const Order = require('../models/Order');

const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const dayName = (isoDate) =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(isoDate).getDay()];

const wma = (values) => {
  if (!values.length) return 0;
  const weights = values.map((_, i) => i + 1);
  const totalWeight = weights.reduce((s, w) => s + w, 0);
  return values.reduce((s, v, i) => s + v * weights[i], 0) / totalWeight;
};

const linearRegression = (ys) => {
  const n = ys.length;
  if (n < 2) return { slope: 0, intercept: ys[0] || 0 };
  const xs = Array.from({ length: n }, (_, i) => i);
  const xMean = (n - 1) / 2;
  const yMean = ys.reduce((s, v) => s + v, 0) / n;
  const num = xs.reduce((s, x, i) => s + (x - xMean) * (ys[i] - yMean), 0);
  const den = xs.reduce((s, x) => s + (x - xMean) ** 2, 0);
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: yMean - slope * xMean };
};

const stdDev = (values, mean) => {
  if (values.length < 2) return 0;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

const forecastSeries = (history, horizon = 14) => {
  if (!history.length) return [];

  const values = history.map(h => h.qty);
  const { slope, intercept } = linearRegression(values);
  const n = values.length;
  const trendMean = intercept + slope * (n - 1);
  const sd = stdDev(values, trendMean);

  const dowSums = Array(7).fill(0);
  const dowCounts = Array(7).fill(0);
  history.forEach(h => {
    const dow = new Date(h.date).getDay();
    dowSums[dow] += h.qty;
    dowCounts[dow] += 1;
  });
  const globalMean = values.reduce((s, v) => s + v, 0) / values.length || 1;
  const dowMultipliers = dowSums.map((s, i) =>
    dowCounts[i] > 0 ? (s / dowCounts[i]) / globalMean : 1
  );

  const forecasts = [];
  const lastDate = new Date(history[history.length - 1].date);

  for (let i = 1; i <= horizon; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(lastDate.getDate() + i);
    const iso = toISO(forecastDate);
    const dow = forecastDate.getDay();

    const recent7 = values.slice(-7);
    const wmaVal = wma(recent7);
    const trendVal = intercept + slope * (n + i - 1);

    const raw = (wmaVal * 0.6 + trendVal * 0.4) * dowMultipliers[dow];
    const predicted = Math.max(0, Math.round(raw));

    const uncertainty = sd * (1 + i * 0.05);
    const low = Math.max(0, Math.round(predicted - uncertainty));
    const high = Math.round(predicted + uncertainty);

    forecasts.push({
      date: iso,
      day: dayName(iso),
      predicted,
      low,
      high,
      trend: slope > 0.5 ? 'up' : slope < -0.5 ? 'down' : 'stable',
    });
  }
  return forecasts;
};

exports.getDemandForecast = async (req, res) => {
  try {
    const horizon = Math.min(parseInt(req.query.horizon) || 14, 30);

    const since = new Date();
    since.setDate(since.getDate() - 90);

    const orders = await Order.find({
      status: 'Served',
      createdAt: { $gte: since },
    }).lean();

    if (!orders.length) {
      return res.status(200).json({
        status: 'success',
        data: {
          overall: [],
          byItem: [],
          byCategory: [],
          insights: [],
          summary: {
            totalOrders: 0,
            totalItems: 0,
            topItem: null,
            forecastPeriod: horizon
          },
        },
      });
    }

    const dailyOrders = {};
    const itemDailyMap = {};
    const catDailyMap = {};

    orders.forEach(order => {
      const date = toISO(new Date(order.createdAt));

      dailyOrders[date] = (dailyOrders[date] || 0) + 1;

      (order.items || []).forEach(item => {
        const name = item.name || '';
        const qty = item.quantity || 1;
        const cat = 'General';

        if (!itemDailyMap[name]) itemDailyMap[name] = {};
        if (!catDailyMap[cat]) catDailyMap[cat] = {};

        itemDailyMap[name][date] = (itemDailyMap[name][date] || 0) + qty;
        catDailyMap[cat][date] = (catDailyMap[cat][date] || 0) + qty;
      });
    });

    const allDates = [];
    const cursor = new Date(since);
    const today = new Date();
    while (cursor <= today) {
      allDates.push(toISO(new Date(cursor)));
      cursor.setDate(cursor.getDate() + 1);
    }

    const fillSeries = (map) =>
      allDates.map(date => ({ date, qty: map[date] || 0 }));

    const overallHistory = fillSeries(dailyOrders);
    const overallForecast = forecastSeries(overallHistory, horizon);

    const itemTotals = Object.entries(itemDailyMap)
      .map(([name, map]) => ({
        name,
        total: Object.values(map).reduce((s, v) => s + v, 0),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    const byItem = itemTotals.map(({ name, total }) => {
      const history = fillSeries(itemDailyMap[name]);
      const forecast = forecastSeries(history, horizon);
      const recent7 = history.slice(-7).map(h => h.qty);
      const prev7 = history.slice(-14, -7).map(h => h.qty);
      const recentAvg = recent7.reduce((s, v) => s + v, 0) / Math.max(recent7.length, 1);
      const prevAvg = prev7.reduce((s, v) => s + v, 0) / Math.max(prev7.length, 1);
      const change = prevAvg > 0 ? ((recentAvg - prevAvg) / prevAvg) * 100 : 0;

      return {
        name,
        totalSold: total,
        history: history.slice(-30),
        forecast,
        weeklyAvg: Math.round(recentAvg * 7),
        trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
        changePercent: Math.round(change),
        nextWeekTotal: forecast.slice(0, 7).reduce((s, f) => s + f.predicted, 0),
      };
    });

    const dowPattern = Array(7).fill(0).map((_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      orders: 0,
      count: 0,
    }));

    orders.forEach(o => {
      const dow = new Date(o.createdAt).getDay();
      dowPattern[dow].orders += 1;
      dowPattern[dow].count += 1;
    });

    const dowMax = Math.max(...dowPattern.map(d => d.orders), 1);
    const dayOfWeekPattern = dowPattern.map(d => ({
      ...d,
      pct: Math.round((d.orders / dowMax) * 100),
    }));

    const hourlyMap = Array(24).fill(0);
    orders.forEach(o => {
      hourlyMap[new Date(o.createdAt).getHours()] += 1;
    });

    const hourlyMax = Math.max(...hourlyMap, 1);
    const hourlyPattern = hourlyMap.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count,
      pct: Math.round((count / hourlyMax) * 100),
    }));

    const insights = [];
    const nextWeekTotal = overallForecast.slice(0, 7).reduce((s, f) => s + f.predicted, 0);
    const thisWeekActual = overallHistory.slice(-7).reduce((s, h) => s + h.qty, 0);
    const weekChange = thisWeekActual > 0
      ? Math.round(((nextWeekTotal - thisWeekActual) / thisWeekActual) * 100)
      : 0;

    insights.push({
      type: weekChange >= 0 ? 'positive' : 'warning',
      title: `Next week demand ${weekChange >= 0 ? 'up' : 'down'} ${Math.abs(weekChange)}%`,
      detail: `Forecasted ${nextWeekTotal} orders vs ${thisWeekActual} last week.`,
      icon: weekChange >= 0 ? 'trending-up' : 'trending-down',
    });

    const peakDay = dayOfWeekPattern.reduce((a, b) => b.orders > a.orders ? b : a);
    insights.push({
      type: 'info',
      title: `${peakDay.day} is your busiest day`,
      detail: `Average ${Math.round(peakDay.orders / Math.max(peakDay.count || 1, 1))} orders. Staff up accordingly.`,
      icon: 'calendar',
    });

    const peakHour = hourlyPattern.reduce((a, b) => b.count > a.count ? b : a);
    insights.push({
      type: 'info',
      title: `Peak hour: ${peakHour.hour}`,
      detail: `Highest order volume. Ensure kitchen and staff are ready.`,
      icon: 'clock',
    });

    const risingItems = byItem.filter(i => i.trend === 'up').slice(0, 2);
    if (risingItems.length) {
      insights.push({
        type: 'positive',
        title: `Rising: ${risingItems.map(i => i.name).join(', ')}`,
        detail: `Demand up ${risingItems.map(i => `${i.changePercent}%`).join(', ')}. Consider stocking more ingredients.`,
        icon: 'star',
      });
    }

    const fallingItems = byItem.filter(i => i.trend === 'down').slice(0, 2);
    if (fallingItems.length) {
      insights.push({
        type: 'warning',
        title: `Declining: ${fallingItems.map(i => i.name).join(', ')}`,
        detail: `Demand down ${fallingItems.map(i => `${Math.abs(i.changePercent)}%`).join(', ')}. Review menu or promotions.`,
        icon: 'alert',
      });
    }

    const summary = {
      totalOrders: orders.length,
      totalItems: orders.reduce((s, o) => s + (o.items || []).reduce((ss, i) => ss + (i.quantity || 1), 0), 0),
      topItem: byItem[0]?.name || null,
      forecastPeriod: horizon,
      nextWeekOrders: nextWeekTotal,
      weekChange,
      avgDailyOrders: Math.round(orders.length / Math.max(allDates.length, 1)),
    };

    return res.status(200).json({
      status: 'success',
      data: {
        overall: overallForecast,
        overallHistory: overallHistory.slice(-30),
        byItem,
        dayOfWeekPattern,
        hourlyPattern,
        insights,
        summary,
      },
    });
  } catch (err) {
    console.error('Demand forecast error:', err);
    return res.status(500).json({ status: 'error', message: 'Forecast failed: ' + err.message });
  }
};