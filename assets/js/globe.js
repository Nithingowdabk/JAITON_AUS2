/**
 * JAITON TECHNOLOGIES — Realistic 3D Dot-Matrix Continental Globe
 * High-performance 3D canvas rendering world landmasses, glowing atmosphere,
 * parabolic energy arcs, and live pinging office beacons.
 */

class InteractiveGlobe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.rotationY = 0;
    this.rotationX = 0.22;
    
    // Active 3 Hub Locations
    this.nodes = [
      { name: 'Sydney (HQ)', lat: -33.8688, lng: 151.2093, color: '#8B5CF6' },
      { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, color: '#A78BFA' },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946, color: '#3B82F6' }
    ];

    this.landDots = [];
    this.arcParticles = [];
    this.pulseAngle = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.generateLandDots();
    this.generateArcParticles();
    this.animate();
  }

  // Generates dense dot-matrix points mapping continental landmasses
  generateLandDots() {
    this.landDots = [];
    const step = 3.5; // Degree sampling step

    // Defined latitude/longitude bounding boxes for world continents
    const continents = [
      // Australia
      { latMin: -42, latMax: -11, lngMin: 113, lngMax: 154 },
      // India & South Asia
      { latMin: 6, latMax: 35, lngMin: 68, lngMax: 92 },
      // Southeast Asia & East Asia
      { latMin: 1, latMax: 52, lngMin: 95, lngMax: 145 },
      // Africa
      { latMin: -35, latMax: 36, lngMin: -17, lngMax: 51 },
      // Europe
      { latMin: 36, latMax: 70, lngMin: -10, lngMax: 45 },
      // North America
      { latMin: 15, latMax: 72, lngMin: -130, lngMax: -60 },
      // South America
      { latMin: -55, latMax: 12, lngMin: -80, lngMax: -35 },
      // Middle East
      { latMin: 12, latMax: 38, lngMin: 35, lngMax: 65 }
    ];

    continents.forEach(box => {
      for (let lat = box.latMin; lat <= box.latMax; lat += step) {
        for (let lng = box.lngMin; lng <= box.lngMax; lng += step) {
          // Add organic coast noise filtering
          if (Math.random() > 0.18) {
            const xyz = this.latLngToXYZ(lat + (Math.random() - 0.5) * 1.5, lng + (Math.random() - 0.5) * 1.5);
            this.landDots.push(xyz);
          }
        }
      }
    });

    // Add sparse ocean latitude/longitude grid lines for 3D depth context
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lng = -180; lng <= 180; lng += 12) {
        const xyz = this.latLngToXYZ(lat, lng);
        xyz.isGrid = true;
        this.landDots.push(xyz);
      }
    }
  }

  generateArcParticles() {
    this.arcParticles = [];
    // Particles travelling along Sydney -> Bangalore and Sydney -> Johannesburg
    for (let i = 0; i < 20; i++) {
      this.arcParticles.push({
        targetIndex: (i % 2 === 0) ? 1 : 2, // 1: JHB, 2: BLR
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.008
      });
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    const size = Math.min(parent.clientWidth || 450, 560);
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    
    this.radius = (size * dpr * 0.38);
    this.centerX = (size * dpr) / 2;
    this.centerY = (size * dpr) / 2;
  }

  latLngToXYZ(lat, lng) {
    const radLat = (lat * Math.PI) / 180;
    const radLng = (lng * Math.PI) / 180;
    return {
      x: Math.cos(radLat) * Math.sin(radLng),
      y: -Math.sin(radLat),
      z: Math.cos(radLat) * Math.cos(radLng)
    };
  }

  project(x, y, z) {
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);

    // Y Rotation
    let x1 = x * cosY - z * sinY;
    let z1 = z * cosY + x * sinY;

    // X Rotation
    let y2 = y * cosX - z1 * sinX;
    let z2 = z1 * cosX + y * sinX;

    const perspective = 1 / (1 - z2 * 0.2);

    return {
      x: this.centerX + x1 * this.radius * perspective,
      y: this.centerY + y2 * this.radius * perspective,
      z: z2,
      scale: perspective,
      visible: z2 > -0.15
    };
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.rotationY = (this.rotationY + 0.004) % (Math.PI * 2); // Infinite smooth 60FPS rotation
    this.pulseAngle = (this.pulseAngle + 0.04) % (Math.PI * 2);

    // 1. Draw Realistic Shaded Planet Globe Core Body
    const planetBody = this.ctx.createRadialGradient(
      this.centerX - this.radius * 0.3, this.centerY - this.radius * 0.3, this.radius * 0.1,
      this.centerX, this.centerY, this.radius * 1.05
    );
    planetBody.addColorStop(0, '#1E1B4B');   // Deep indigo core
    planetBody.addColorStop(0.5, '#0F172A'); // Dark midnight slate
    planetBody.addColorStop(1, '#090D16');   // Deep dark boundary

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = planetBody;
    this.ctx.fill();

    // 2. Outer Atmosphere Glowing Rim
    const atmosphereGlow = this.ctx.createRadialGradient(
      this.centerX, this.centerY, this.radius * 0.95,
      this.centerX, this.centerY, this.radius * 1.25
    );
    atmosphereGlow.addColorStop(0, 'rgba(108, 59, 255, 0.28)');
    atmosphereGlow.addColorStop(0.4, 'rgba(37, 99, 235, 0.14)');
    atmosphereGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius * 1.25, 0, Math.PI * 2);
    this.ctx.fillStyle = atmosphereGlow;
    this.ctx.fill();

    // 3. Render 3D Dot-Matrix Continent Landmasses
    this.landDots.forEach(pt => {
      const p = this.project(pt.x, pt.y, pt.z);
      if (!p.visible) return;

      const alpha = Math.max(0.1, (p.z + 0.15) / 1.15);

      this.ctx.beginPath();
      if (pt.isGrid) {
        // Faint ocean grid dots
        this.ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.12})`;
        this.ctx.arc(p.x, p.y, 1 * p.scale, 0, Math.PI * 2);
      } else {
        // Bright continental land dots
        this.ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.85})`;
        this.ctx.arc(p.x, p.y, 1.6 * p.scale, 0, Math.PI * 2);
      }
      this.ctx.fill();
    });

    // 4. Calculate Projected City Node Positions
    const projNodes = this.nodes.map(n => {
      const xyz = this.latLngToXYZ(n.lat, n.lng);
      return { ...n, xyz, ...this.project(xyz.x, xyz.y, xyz.z) };
    });

    const sydney = projNodes[0];

    // 5. Draw Parabolic 3D Energy Arcs from Sydney to Johannesburg & Bangalore
    projNodes.forEach((dest, idx) => {
      if (idx === 0) return;

      // Parabolic 3D Arch Calculation lifting above planet surface
      const steps = 30;
      this.ctx.beginPath();
      let first = true;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        // Interpolate lat/lng along shortest arc
        const lat = sydney.lat + (dest.lat - sydney.lat) * t;
        const lng = sydney.lng + (dest.lng - sydney.lng) * t;
        const baseXYZ = this.latLngToXYZ(lat, lng);
        
        // Arch height parabola multiplier
        const archHeight = 1 + Math.sin(t * Math.PI) * 0.28;
        const arcXYZ = {
          x: baseXYZ.x * archHeight,
          y: baseXYZ.y * archHeight,
          z: baseXYZ.z * archHeight
        };

        const p = this.project(arcXYZ.x, arcXYZ.y, arcXYZ.z);
        if (p.visible) {
          if (first) { this.ctx.moveTo(p.x, p.y); first = false; }
          else { this.ctx.lineTo(p.x, p.y); }
        }
      }

      this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    });

    // 6. Draw Glowing Arc Data Particles
    this.arcParticles.forEach(particle => {
      particle.progress += particle.speed;
      if (particle.progress > 1) particle.progress = 0;

      const dest = projNodes[particle.targetIndex];
      if (!sydney.visible || !dest || !dest.visible) return;

      const t = particle.progress;
      const lat = sydney.lat + (dest.lat - sydney.lat) * t;
      const lng = sydney.lng + (dest.lng - sydney.lng) * t;
      const baseXYZ = this.latLngToXYZ(lat, lng);
      
      const archHeight = 1 + Math.sin(t * Math.PI) * 0.28;
      const p = this.project(baseXYZ.x * archHeight, baseXYZ.y * archHeight, baseXYZ.z * archHeight);

      if (p.visible) {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#60A5FA';
        this.ctx.shadowColor = '#3B82F6';
        this.ctx.shadowBlur = 10;
        this.ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });

    // 7. Draw City Beacons, Radar Rings, and Glass Tags
    projNodes.forEach(node => {
      if (!node.visible) return;

      // Expanding Radar Pulse Wave (Guaranteed positive radius between 4px and 14px)
      const normPulse = (Math.sin(this.pulseAngle) + 1) / 2; // Always 0.0 to 1.0
      const pulseSize = Math.max(0.1, 4 + normPulse * 10);
      const pulseAlpha = Math.max(0.05, 0.6 * (1 - normPulse));

      this.ctx.beginPath();
      this.ctx.strokeStyle = node.color;
      this.ctx.globalAlpha = pulseAlpha;
      this.ctx.lineWidth = 1.5;
      this.ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1.0;

      // Solid Glow Core
      this.ctx.beginPath();
      this.ctx.fillStyle = node.color;
      this.ctx.shadowColor = node.color;
      this.ctx.shadowBlur = 12;
      this.ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Premium Glass Label Card Tag
      const paddingX = 10;
      const paddingY = 6;
      this.ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      const textWidth = this.ctx.measureText(node.name).width;

      const tagX = node.x + 12;
      const tagY = node.y - 12;

      // Tag Glass Background
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      this.ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
      this.ctx.lineWidth = 1;

      this.ctx.beginPath();
      if (this.ctx.roundRect) {
        this.ctx.roundRect(tagX, tagY - 12, textWidth + paddingX * 2, 22, 6);
      } else {
        this.ctx.rect(tagX, tagY - 12, textWidth + paddingX * 2, 22);
      }
      this.ctx.fill();
      this.ctx.stroke();

      // Tag Label Text
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillText(node.name, tagX + paddingX, tagY + 3);
    });

  }
}

document.addEventListener('DOMContentLoaded', () => {
  new InteractiveGlobe('globeCanvas');
});
