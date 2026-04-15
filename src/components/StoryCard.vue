<template>
  <div class="story-card" @click="$emit('click')">
    <div class="card-image">
      <img :src="story.photoUrl" :alt="story.name" />
    </div>

    <div class="card-content">
      <h3>{{ story.name }}</h3>
      <p class="description">{{ story.description }}</p>
      <p v-if="story.lat" class="location">📍 Terlokasi</p>
    </div>
    
    <div class="card-footer">
      <button class="read-more">Read More →</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  story: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.story-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 200ms, box-shadow 200ms;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.story-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Card Image */
.card-image {
  overflow: hidden;
  height: 180px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 200ms;
}

.story-card:hover .card-image img {
  transform: scale(1.05);
}

/* Card Content */
.card-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #222;
  line-height: 1.3;
}

.description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  flex: 1;
}

.location {
  margin: 0;
  font-size: 13px;
  color: #0066cc;
  font-weight: 500;
}

/* Card Footer */
.card-footer {
  padding: 0 16px 16px 16px;
}

.read-more {
  width: 100%;
  background: #0066cc;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background 200ms;
  font-size: 14px;
}

.read-more:hover {
  background: #0052a3;
}

/* Responsive */
@media (max-width: 768px) {
  .card-image {
    height: 150px;
  }
  
  .card-content {
    padding: 12px;
  }
  
  .card-content h3 {
    font-size: 16px;
  }
}
</style>