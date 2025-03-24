<template>
  <div class="home">
    <h1>海报生成器</h1>
    <div class="poster-types">
      <router-link to="/poster-creator" class="poster-type">
        <div class="poster-card">
          <h2>自定义海报</h2>
          <p>完全自定义的海报制作工具</p>
          <ul>
            <li>自由布局</li>
            <li>元素可拖拽</li>
            <li>高度自定义</li>
          </ul>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 3rem;
}

.poster-types {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.poster-type {
  text-decoration: none;
  color: inherit;
  flex: 1;
  max-width: 400px;
}

.poster-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.poster-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  color: #1a73e8;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 1.5rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  color: #444;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

li::before {
  content: "✓";
  color: #4CAF50;
  position: absolute;
  left: 0;
}
</style> 