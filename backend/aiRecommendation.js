const fs = require('fs');
const csv = require('csv-parser');
const natural = require('natural');

class AIRecommendationEngine {
  constructor() {
    this.menuItems = [];
    this.tfidf = new natural.TfIdf();
    this.isLoaded = false;
  }

  async loadMenuData(csvPath) {
    return new Promise((resolve, reject) => {
      const items = [];
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          items.push({
            id: items.length + 1,
            name: row['Dish Name'],
            ingredients: row['Ingredients Used'] ? row['Ingredients Used'].split(',').map(i => i.trim()) : [],
            price: parseFloat(row['Price']) || 0,
            timeConsumed: parseInt(row['Time Consumed']) || 0,
            category: row['Menu Group'],
            description: this.generateDescription(row)
          });
        })
        .on('end', () => {
          this.menuItems = items;
          this.buildSearchIndex();
          this.isLoaded = true;
          console.log(`✅ Loaded ${items.length} menu items from CSV`);
          resolve(items);
        })
        .on('error', (error) => {
          console.error('❌ Error loading CSV:', error);
          reject(error);
        });
    });
  }

  buildSearchIndex() {
    this.menuItems.forEach((item) => {
      const text = `${item.name} ${item.ingredients.join(' ')} ${item.category}`;
      this.tfidf.addDocument(text);
    });
  }

  generateDescription(row) {
    const ingredients = row['Ingredients Used'] ? row['Ingredients Used'].split(',') : [];
    const randomDescriptors = ['delicious', 'flavorful', 'mouth-watering', 'tasty', 'exquisite'];
    const descriptor = randomDescriptors[Math.floor(Math.random() * randomDescriptors.length)];
    
    return `A ${descriptor} ${row['Menu Group'] ? row['Menu Group'].toLowerCase() : 'dish'} made with ${ingredients.slice(0, 3).join(', ')}.`;
  }

  recommendByIngredients(currentOrderItems, count = 5) {
    if (!this.isLoaded || !currentOrderItems || currentOrderItems.length === 0) {
      return this.getPopularItems(count);
    }

    const currentIngredients = new Set();
    currentOrderItems.forEach(item => {
      const menuItem = this.findMenuItemByName(item.name);
      if (menuItem && menuItem.ingredients) {
        menuItem.ingredients.forEach(ing => currentIngredients.add(ing.toLowerCase()));
      }
    });

    const scoredItems = this.menuItems.map(item => {
      const commonIngredients = item.ingredients.filter(ing => 
        currentIngredients.has(ing.toLowerCase())
      ).length;
      
      const ingredientScore = commonIngredients / Math.max(item.ingredients.length, 1);
      const timeScore = 1 - (item.timeConsumed / 60); 
      const priceScore = 1 - (item.price / 1500); 
      
      const totalScore = 
        (ingredientScore * 0.5) + 
        (timeScore * 0.3) + 
        (priceScore * 0.2);

      return {
        ...item,
        score: totalScore,
        reason: commonIngredients > 0 
          ? `Contains similar ingredients: ${item.ingredients.slice(0, 3).join(', ')}`
          : 'Popular choice'
      };
    });

    return scoredItems
      .filter(item => !currentOrderItems.some(orderItem => orderItem.name === item.name))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  getPopularItems(count = 5) {
    if (!this.isLoaded) return [];

    return this.menuItems
      .sort((a, b) => {
        const popularityA = (1500 - a.price) * 0.6 + (60 - a.timeConsumed) * 0.4;
        const popularityB = (1500 - b.price) * 0.6 + (60 - b.timeConsumed) * 0.4;
        return popularityB - popularityA;
      })
      .slice(0, count)
      .map(item => ({
        ...item,
        score: 0.8,
        reason: 'Popular choice among customers'
      }));
  }

  recommendComplements(currentOrderItems, count = 3) {
    if (!this.isLoaded || !currentOrderItems || currentOrderItems.length === 0) {
      return this.getPopularItems(count);
    }

    const categoryCount = {};
    currentOrderItems.forEach(item => {
      const menuItem = this.findMenuItemByName(item.name);
      if (menuItem) {
        categoryCount[menuItem.category] = (categoryCount[menuItem.category] || 0) + 1;
      }
    });

    const complementaryMap = {
      'Momo': ['Drinks', 'Fresh Juice'],
      'Chowmein': ['Drinks', 'Fresh Juice'],
      'Rice': ['Drinks', 'Starters'],
      'Pizza': ['Drinks', 'Desserts'],
      'Pasta': ['Drinks', 'Desserts'],
      'Sandwich': ['Drinks', 'Fresh Juice'],
      'Starters': ['Momo', 'Drinks'],
      'BBQ / Sekuwa': ['Drinks', 'Rice'],
      'Newari Khaja Set': ['Drinks'],
      'Desserts': ['Drinks', 'Fresh Juice'],
      'Drinks': ['Desserts', 'Smoking'],
      'Fresh Juice': ['Desserts'],
      'Smoking': ['Drinks']
    };

    const targetCategories = new Set();
    Object.keys(categoryCount).forEach(cat => {
      complementaryMap[cat]?.forEach(compCat => targetCategories.add(compCat));
    });

    const complementaryItems = this.menuItems
      .filter(item => targetCategories.has(item.category))
      .sort((a, b) => a.timeConsumed - b.timeConsumed)
      .slice(0, count)
      .map(item => ({
        ...item,
        score: 0.7,
        reason: `Complements your ${currentOrderItems[0]?.name || 'order'}`
      }));

    return complementaryItems;
  }

  searchMenuItems(query, limit = 10) {
    if (!this.isLoaded) return [];
    
    if (!query || query.trim() === '') {
      return this.menuItems.slice(0, limit);
    }

    const scores = {};
    this.tfidf.tfidfs(query, (i, measure) => {
      scores[i] = measure;
    });

    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([index]) => this.menuItems[parseInt(index)])
      .filter(item => item)
      .slice(0, limit);
  }

  findSimilarItems(itemName, count = 5) {
    if (!this.isLoaded) return [];
    
    const targetItem = this.findMenuItemByName(itemName);
    if (!targetItem) return [];

    return this.menuItems
      .filter(item => item.name !== itemName && item.category === targetItem.category)
      .map(item => {
        const ingredientOverlap = item.ingredients.filter(ing => 
          targetItem.ingredients.includes(ing)
        ).length;
        
        const score = ingredientOverlap / Math.max(targetItem.ingredients.length, 1);
        
        return {
          ...item,
          score,
          reason: ingredientOverlap > 0 
            ? `Similar ingredients: ${item.ingredients.slice(0, 3).join(', ')}`
            : `Same category: ${item.category}`
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  findMenuItemByName(name) {
    return this.menuItems.find(item => item.name === name);
  }

  getAISuggestions(currentOrderItems) {
    if (!this.isLoaded) return [];

    const recommendations = {
      basedOnIngredients: this.recommendByIngredients(currentOrderItems, 3),
      complementaryItems: this.recommendComplements(currentOrderItems, 2),
      popularItems: this.getPopularItems(2)
    };

    const allSuggestions = new Map();
    
    Object.values(recommendations).flat().forEach(item => {
      if (!allSuggestions.has(item.id)) {
        allSuggestions.set(item.id, item);
      }
    });

    return Array.from(allSuggestions.values()).slice(0, 5);
  }
}

module.exports = AIRecommendationEngine;