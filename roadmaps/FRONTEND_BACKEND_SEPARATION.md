# Frontend/Backend Separation Roadmap

## Overview

This roadmap outlines the implementation plan for optimizing the Remotion Rendering Engine to support complete separation between frontend Studio preview and backend rendering services. While the current architecture already supports basic separation, this roadmap defines enhancements to make it production-ready and scalable.

## Current State Analysis

### ✅ What Already Works

#### **Shared Component Library**
```typescript
// Components work in both Studio and rendering
export { GenerativeCanvas, HyperspaceText } from './src/components';
```

#### **Schema-Driven Configuration**
```typescript
// Same validation for both environments
export const VideoRequestSchema = z.object({
  timeline: z.array(ComponentSchema)
});
```

#### **API-Driven Rendering**
```typescript
// RESTful endpoints for render management
POST /renders     // Create render job
GET /renders/:id  // Check status
```

#### **Pre-warmed Infrastructure**
- Browser instance reuse
- Composition caching
- Optimized rendering pipeline

### ❌ Current Limitations

1. **Package Structure**: Components not easily importable from external projects
2. **Configuration Management**: Mixed Studio/Server configs
3. **CORS Setup**: Limited cross-origin support
4. **API Completeness**: Missing introspection endpoints
5. **Documentation**: Separation patterns not documented
6. **Deployment**: No containerized separation examples

## Implementation Roadmap

### 🔵 Phase 1: Package Structure Optimization
**Priority**: High | **Effort**: Medium | **Timeline**: 2-3 weeks

#### 1.1 Extract Components Package
- [ ] Create `@renderer/components` npm package
- [ ] Move `src/components/` to separate package
- [ ] Export all components and types
- [ ] Update import paths in main project

**Technical Implementation**:
```bash
# Create new package
mkdir packages/components
cd packages/components
npm init @renderer/components

# Move files
mv ../../src/components/* ./src/
mv ../../src/hooks/* ./src/hooks/

# Update package.json
{
  "name": "@renderer/components",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "react": "^18.0.0",
    "remotion": "^4.0.0",
    "gsap": "^3.0.0"
  }
}
```

#### 1.2 Extract Schema Package
- [ ] Create `@renderer/schemas` npm package
- [ ] Move validation schemas
- [ ] Export TypeScript types

#### 1.3 Update Main Project
- [ ] Install local packages as dependencies
- [ ] Update all import statements
- [ ] Test Studio and rendering still work

### 🔵 Phase 2: Configuration Separation
**Priority**: High | **Effort**: Low | **Timeline**: 1 week

#### 2.1 Environment-Specific Configs
- [ ] Create `config/studio.config.ts`
- [ ] Create `config/server.config.ts`
- [ ] Separate Remotion configs by environment

**Technical Implementation**:
```typescript
// config/studio.config.ts
export const studioConfig = {
  port: 3001,
  enableRendering: false,
  corsOrigins: ['http://localhost:3000'],
  features: {
    preview: true,
    editing: true,
    rendering: false
  }
};

// config/server.config.ts
export const serverConfig = {
  port: 3000,
  rendersDir: './renders',
  maxConcurrentRenders: 2,
  browserPoolSize: 1,
  features: {
    preview: false,
    editing: false,
    rendering: true
  }
};
```

#### 2.2 CORS Enhancement
- [ ] Add comprehensive CORS configuration
- [ ] Support multiple frontend origins
- [ ] Environment-based CORS settings

### 🔵 Phase 3: API Enhancement
**Priority**: Medium | **Effort**: Medium | **Timeline**: 2 weeks

#### 3.1 Component Introspection API
- [ ] Enhance `/components` endpoint
- [ ] Add component preview endpoints
- [ ] Add prop validation endpoints

**Technical Implementation**:
```typescript
// New endpoints
GET /api/components              // List all components
GET /api/components/:name        // Get component details
POST /api/components/:name/preview // Generate preview
GET /api/components/:name/schema   // Get prop schema
```

#### 3.2 Render Management API
- [ ] Add render queue status endpoint
- [ ] Add bulk render operations
- [ ] Add render history endpoints

#### 3.3 Preview Generation
- [ ] Add thumbnail generation
- [ ] Add frame extraction
- [ ] Add preview video generation

### 🔵 Phase 4: Development Workflow
**Priority**: Medium | **Effort**: Low | **Timeline**: 1 week

#### 4.1 Scripts and Commands
```json
{
  "scripts": {
    "studio:dev": "remotion studio --port 3001",
    "studio:prod": "remotion studio --port 3001 --host 0.0.0.0",
    "server:dev": "tsx watch server --env development",
    "server:prod": "tsx server --env production",
    "dev:separated": "concurrently \"npm run studio:dev\" \"npm run server:dev\"",
    "build:components": "cd packages/components && npm run build",
    "build:all": "npm run build:components && npm run build"
  }
}
```

#### 4.2 Docker Configuration
- [ ] Create `docker/studio.dockerfile`
- [ ] Create `docker/server.dockerfile`
- [ ] Create `docker-compose.separated.yml`

**Technical Implementation**:
```dockerfile
# docker/studio.dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/components ./packages/components
RUN npm install
COPY remotion ./remotion
COPY src ./src
EXPOSE 3001
CMD ["npm", "run", "studio:prod"]

# docker/server.dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
RUN npm install
COPY server ./server
COPY src ./src
EXPOSE 3000
CMD ["npm", "run", "server:prod"]
```

### 🔵 Phase 5: Documentation & Examples
**Priority**: Medium | **Effort**: Medium | **Timeline**: 1-2 weeks

#### 5.1 Architecture Documentation
- [ ] Document separation patterns
- [ ] Create deployment guides
- [ ] Add troubleshooting guides

#### 5.2 Integration Examples
- [ ] Custom React frontend example
- [ ] Next.js integration example
- [ ] API client library

#### 5.3 Developer Experience
- [ ] Update README with separation instructions
- [ ] Create migration guide from monolithic setup
- [ ] Add TypeScript definitions for API

## Deployment Architectures

### Current: Monolithic
```
┌─────────────────────┐
│  Single Process     │
│  ┌─────────────────┐│
│  │ Remotion Studio ││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ Render Server   ││
│  └─────────────────┘│
└─────────────────────┘
```

### Target: Separated Services
```
┌─────────────────────┐    ┌─────────────────────┐
│  Frontend Service   │    │  Backend Service    │
│  ┌─────────────────┐│    │  ┌─────────────────┐│
│  │ Remotion Studio ││    │  │ Render Server   ││
│  │                 ││    │  │                 ││
│  │ + Custom UI     ││◄──►│  │ + Queue Mgmt    ││
│  │ + Preview       ││    │  │ + File Storage  ││
│  └─────────────────┘│    │  └─────────────────┘│
└─────────────────────┘    └─────────────────────┘
        Port 3001                   Port 3000
```

### Advanced: Microservices
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Frontend   │  │  API Gateway │  │   Renderer   │
│              │  │              │  │              │
│ Studio/UI    │◄─│  Routing     │◄─│ Queue/Engine │
│              │  │  Auth        │  │              │
└──────────────┘  │  Rate Limit  │  └──────────────┘
                  └──────────────┘
                         │
                  ┌──────────────┐
                  │  File Store  │
                  │              │
                  │ S3/Storage   │
                  └──────────────┘
```

## Benefits & Use Cases

### Development Benefits
- **Faster Iteration**: Studio changes without server restarts
- **Isolated Testing**: Test components without rendering
- **Better DevX**: Clearer separation of concerns

### Production Benefits
- **Scalability**: Scale frontend and backend independently
- **Reliability**: Frontend failures don't affect rendering
- **Performance**: Optimized builds for each service
- **Security**: Isolate rendering from public traffic

### Business Benefits
- **Cost Optimization**: Scale services based on demand
- **Team Productivity**: Frontend and backend teams work independently
- **Deployment Flexibility**: Deploy services on different schedules

## Use Cases

### 1. Development Team
```typescript
// Developer workflow
npm run studio:dev    // Local preview on :3001
npm run server:dev    // Local rendering on :3000

// Test component in Studio
// Send to server for final render
```

### 2. Production SaaS
```typescript
// Frontend (customer-facing)
- Studio UI on subdomain: studio.company.com
- Custom UI for non-technical users
- Real-time preview and editing

// Backend (internal)
- Render farm on internal network
- Queue management and scaling
- File storage and delivery
```

### 3. White-label Integration
```typescript
// Partner integration
import { GenerativeCanvas } from '@renderer/components';

// Preview in partner's app
<GenerativeCanvas {...props} />

// Render via API
fetch('/api/render', { 
  method: 'POST',
  body: JSON.stringify(config)
});
```

## Timeline & Priorities

### High Priority (Q1 2025)
- ✅ **Phase 1**: Package extraction - Critical for external usage
- ✅ **Phase 2**: Configuration separation - Required for production

### Medium Priority (Q2 2025)
- 🔵 **Phase 3**: API enhancement - Improves developer experience
- 🔵 **Phase 4**: Development workflow - Team productivity

### Low Priority (Q3 2025)
- 🔵 **Phase 5**: Documentation - Important but not blocking

## Dependencies

### Internal Dependencies
- Package extraction must complete before API enhancement
- Configuration separation should happen early
- Documentation requires all other phases

### External Dependencies
- No external blockers identified
- Standard npm/Docker tooling sufficient

## Success Metrics

### Technical Metrics
- [ ] Components can be imported as npm package
- [ ] Studio runs independently on separate port
- [ ] Server handles rendering without Studio
- [ ] API supports external frontends
- [ ] Docker containers work in separation

### Developer Experience Metrics
- [ ] Setup time for new developers < 15 minutes
- [ ] Component development cycle < 30 seconds
- [ ] Clear documentation with examples
- [ ] TypeScript support throughout

### Production Metrics
- [ ] Services can be deployed independently
- [ ] Horizontal scaling works for both services
- [ ] No single points of failure
- [ ] Monitoring and logging separated

---

**Status**: 🔵 Planned  
**Next Steps**: Begin Phase 1 - Package extraction  
**Owner**: Development Team  
**Last Updated**: 2025-08-05