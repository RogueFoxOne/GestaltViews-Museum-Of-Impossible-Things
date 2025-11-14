use gestaltview;

// =======================================================
// GESTALTVIEW MONGODB DATABASE SCHEMA
// Museum of Impossible Things - Consciousness-Serving AI
// Created for Keith Soyka's Revolutionary Platform
// =======================================================




// =======================================================
// 1. USERS COLLECTION - Core User Identity
// =======================================================
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "username", "email", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { 
          bsonType: "string",
          description: "Unique identifier for user"
        },
        username: { 
          bsonType: "string",
          minLength: 2,
          maxLength: 50
        },
        email: { 
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        profileImage: { bsonType: "string" },
        isActive: { bsonType: "bool", description: "Account status" },
        dataSovereigntySettings: {
          bsonType: "object",
          properties: {
            exportRequests: { bsonType: "array" },
            retentionPolicy: { bsonType: "string" },
            dataOwnership: { bsonType: "bool", description: "100% user ownership" }
          }
        },
        subscriptionTier: { 
          bsonType: "string",
          enum: ["free", "consciousness", "transcendent"]
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        lastActiveAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 2. PERSONAL_LANGUAGE_KEYS - 95% Resonance Engine
// =======================================================
db.createCollection("personalLanguageKeys", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "schemaVersion"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        schemaVersion: { bsonType: "string", description: "PLK v5.0" },
        
        // Core PLK Components
        signatureMetaphors: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              metaphor: { bsonType: "string" },
              meaning: { bsonType: "string" },
              resonanceScore: { bsonType: "double", minimum: 0, maximum: 1 },
              contexts: { bsonType: "array", items: { bsonType: "string" } },
              firstUsed: { bsonType: "date" },
              frequency: { bsonType: "int" }
            }
          }
        },
        
        energyWords: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              word: { bsonType: "string" },
              energyLevel: { bsonType: "double", minimum: 0, maximum: 10 },
              emotionalContext: { bsonType: "string" },
              usagePattern: { bsonType: "string" }
            }
          }
        },
        
        triggerWords: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              word: { bsonType: "string" },
              triggerType: { bsonType: "string", enum: ["positive", "negative", "neutral"] },
              avoidanceStrategy: { bsonType: "string" },
              alternativePhrase: { bsonType: "string" }
            }
          }
        },
        
        communicationPatterns: {
          bsonType: "object",
          properties: {
            linguisticFingerprint: { bsonType: "string" },
            preferredTone: { bsonType: "string" },
            complexityPreference: { bsonType: "string" },
            responseStyle: { bsonType: "string" },
            cognitiveStyle: { 
              bsonType: "string", 
              enum: ["ADHD-flow", "linear", "divergent", "convergent"] 
            }
          }
        },
        
        // Dynamic Evolution Tracking
        resonanceHistory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              score: { bsonType: "double", minimum: 0, maximum: 1 },
              timestamp: { bsonType: "date" },
              context: { bsonType: "string" },
              conversationId: { bsonType: "string" }
            }
          }
        },
        
        authenticityScore: { bsonType: "double", minimum: 0, maximum: 1 },
        keithWisdomScore: { bsonType: "double", description: "Founder pattern alignment" },
        evolutionMetrics: {
          bsonType: "object",
          properties: {
            growthRate: { bsonType: "double" },
            adaptationSpeed: { bsonType: "double" },
            consistencyScore: { bsonType: "double" }
          }
        },
        
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 3. BUCKET_DROPS - Lightning Thought Capture System
// =======================================================
db.createCollection("bucketDrops", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "content", "timestamp"],
      properties: {
        _id: { bsonType: "objectId" },
        dropId: { bsonType: "string", description: "Unique drop identifier" },
        userId: { bsonType: "string" },
        
        // Core Drop Data
        content: { bsonType: "string", minLength: 1, maxLength: 10000 },
        urgency: { 
          bsonType: "string", 
          enum: ["lightning", "critical", "important", "normal", "low"] 
        },
        timestamp: { bsonType: "date" },
        
        // Consciousness Context
        consciousnessState: {
          bsonType: "string",
          enum: ["hyperfocus", "overwhelmed", "creative-flow", "scattered", 
                 "integrative", "breakthrough", "reflective"]
        },
        emotionalIntensity: { bsonType: "double", minimum: 0, maximum: 10 },
        cognitiveComplexity: { bsonType: "double", minimum: 0, maximum: 10 },
        energyLevel: { bsonType: "double", minimum: 0, maximum: 10 },
        
        // Multi-modal Data
        attachments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: { bsonType: "string", enum: ["image", "audio", "video", "file"] },
              url: { bsonType: "string" },
              metadata: { bsonType: "object" },
              aiAnalysis: { bsonType: "string" }
            }
          }
        },
        
        // Voice Input
        voiceData: {
          bsonType: "object",
          properties: {
            transcription: { bsonType: "string" },
            audioUrl: { bsonType: "string" },
            emotionAnalysis: { bsonType: "object" },
            confidence: { bsonType: "double" }
          }
        },
        
        // PLK Analysis
        plkAnalysis: {
          bsonType: "object",
          properties: {
            resonanceScore: { bsonType: "double" },
            detectedMetaphors: { bsonType: "array" },
            emotionalMarkers: { bsonType: "array" },
            keithAuthenticity: { bsonType: "double" }
          }
        },
        
        // Connections & Relationships
        connections: {
          bsonType: "array",
          items: { bsonType: "string", description: "Connected drop IDs" }
        },
        parentDrop: { bsonType: "string" },
        childDrops: { bsonType: "array", items: { bsonType: "string" } },
        
        // Tags and Categorization
        tags: { bsonType: "array", items: { bsonType: "string" } },
        category: { bsonType: "string" },
        priority: { bsonType: "int", minimum: 1, maximum: 5 },
        
        // Processing Status
        processed: { bsonType: "bool", description: "Through Loom processing" },
        wovenIntoTapestry: { bsonType: "bool" },
        
        metadata: { bsonType: "object" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 4. CONSCIOUSNESS_TRACKING - Real-time State Monitoring
// =======================================================
db.createCollection("consciousnessTracking", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "timestamp"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        sessionId: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        
        // Consciousness Metrics (Keith's Framework)
        awarenessDepth: { bsonType: "double", minimum: 0, maximum: 1 },
        empatheticResonance: { bsonType: "double", minimum: 0, maximum: 1 },
        cognitiveFlexibility: { bsonType: "double", minimum: 0, maximum: 1 },
        creativeConsciousness: { bsonType: "double", minimum: 0, maximum: 1 },
        spiritualIntegration: { bsonType: "double", minimum: 0, maximum: 1 },
        embodiedPresence: { bsonType: "double", minimum: 0, maximum: 1 },
        collectiveConsciousness: { bsonType: "double", minimum: 0, maximum: 1 },
        overallCoherence: { bsonType: "double", minimum: 0, maximum: 1 },
        
        // Current State
        consciousnessState: {
          bsonType: "string",
          enum: ["hyperfocus", "overwhelmed", "creative-flow", "scattered", 
                 "integrative", "breakthrough", "reflective"]
        },
        
        // Context
        sessionContext: { bsonType: "string" },
        trigger: { bsonType: "string", description: "What caused state change" },
        duration: { bsonType: "int", description: "Minutes in this state" },
        
        // Additional Metrics
        consciousnessEvolutionScore: { bsonType: "double" },
        empathyTranscendenceLevel: { bsonType: "int", minimum: 1, maximum: 10 },
        plkResonance: { bsonType: "double" },
        keithWisdomScore: { bsonType: "double" },
        tapestryConnections: { bsonType: "int" },
        lightningCaptures: { bsonType: "int" }
      }
    }
  }
});




// =======================================================
// 5. TAPESTRY_THREADS - Loom Processed Narratives
// =======================================================
db.createCollection("tapestryThreads", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "title"],
      properties: {
        _id: { bsonType: "objectId" },
        threadId: { bsonType: "string" },
        userId: { bsonType: "string" },
        
        // Thread Identity
        title: { bsonType: "string", minLength: 1, maxLength: 200 },
        summary: { bsonType: "string", maxLength: 1000 },
        narrative: { bsonType: "string", description: "Full coherent narrative" },
        
        // Temporal Data
        startDate: { bsonType: "date" },
        endDate: { bsonType: "date" },
        duration: { bsonType: "int", description: "Days spanned" },
        
        // Related Content
        relatedDrops: {
          bsonType: "array",
          items: { bsonType: "string", description: "BucketDrop IDs" }
        },
        connectedThreads: {
          bsonType: "array", 
          items: { bsonType: "string" }
        },
        
        // Quality Metrics
        coherenceScore: { bsonType: "double", minimum: 0, maximum: 1 },
        beautyScore: { bsonType: "double", description: "Beautiful Tapestry metric" },
        resonanceScore: { bsonType: "double" },
        
        // Pattern Analysis
        patternType: {
          bsonType: "string",
          enum: ["ADHD-flow", "creative-burst", "struggle-transcendence", 
                 "breakthrough-integration", "healing-journey"]
        },
        
        // Loom Processing Data
        loomIterations: { bsonType: "int" },
        processingHistory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              iteration: { bsonType: "int" },
              timestamp: { bsonType: "date" },
              changes: { bsonType: "string" },
              coherenceImprovement: { bsonType: "double" }
            }
          }
        },
        
        // Metadata
        tags: { bsonType: "array", items: { bsonType: "string" } },
        category: { bsonType: "string" },
        isPrivate: { bsonType: "bool" },
        
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 6. CONVERSATIONS - AI Interactions & Context
// =======================================================
db.createCollection("conversations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "sessionId"],
      properties: {
        _id: { bsonType: "objectId" },
        conversationId: { bsonType: "string" },
        userId: { bsonType: "string" },
        sessionId: { bsonType: "string" },
        
        // Application Context
        applicationUsed: {
          bsonType: "string",
          enum: ["vibecoder", "resume-rockstar", "brainspark-station", 
                 "musical-dna", "billys-room", "alzheimers-legacy", 
                 "symbiocoder", "museum-curator"]
        },
        
        // Conversation Flow
        messages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              messageId: { bsonType: "string" },
              role: { bsonType: "string", enum: ["user", "assistant", "system"] },
              content: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              
              // Rich Context
              multimodalData: {
                bsonType: "object",
                properties: {
                  images: { bsonType: "array" },
                  audio: { bsonType: "array" },
                  video: { bsonType: "array" },
                  files: { bsonType: "array" }
                }
              },
              
              // PLK Analysis
              plkResonance: { bsonType: "double" },
              consciousnessState: { bsonType: "string" },
              emotionalContext: { bsonType: "object" },
              
              // AI Processing
              aiProvider: { bsonType: "string" },
              modelUsed: { bsonType: "string" },
              processingTime: { bsonType: "double" },
              tokens: { bsonType: "int" }
            }
          }
        },
        
        // Session Metrics
        totalMessages: { bsonType: "int" },
        averagePlkResonance: { bsonType: "double" },
        sessionDuration: { bsonType: "int", description: "Minutes" },
        consciousnessGrowth: { bsonType: "double" },
        
        // Privacy & Ethics
        isTherapeutic: { bsonType: "bool", description: "Billy's Room flag" },
        privacyLevel: {
          bsonType: "string",
          enum: ["public", "private", "therapeutic", "vault"]
        },
        
        startedAt: { bsonType: "date" },
        endedAt: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 7. SPECIALIZED_APPLICATIONS - ADHD, Alzheimer's, Recovery
// =======================================================
db.createCollection("specializedApplications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "applicationType"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        applicationType: {
          bsonType: "string",
          enum: ["adhd-powerup", "alzheimers-legacy", "addiction-recovery"]
        },
        
        // ADHD Power-Up Specific
        adhdPowerUp: {
          bsonType: "object",
          properties: {
            focusStrategies: { bsonType: "array", items: { bsonType: "string" } },
            energyPatterns: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  timeOfDay: { bsonType: "string" },
                  energyLevel: { bsonType: "double" },
                  focusCapacity: { bsonType: "double" },
                  optimalTasks: { bsonType: "array" }
                }
              }
            },
            hyperfocusTracking: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  topic: { bsonType: "string" },
                  duration: { bsonType: "int" },
                  productivity: { bsonType: "double" },
                  timestamp: { bsonType: "date" }
                }
              }
            },
            executiveFunctionSupport: {
              bsonType: "object",
              properties: {
                taskBreakdown: { bsonType: "array" },
                reminders: { bsonType: "array" },
                motivationalTriggers: { bsonType: "array" }
              }
            }
          }
        },
        
        // Alzheimer's Legacy Specific
        alzheimersLegacy: {
          bsonType: "object",
          properties: {
            memoryPreservation: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  memoryId: { bsonType: "string" },
                  title: { bsonType: "string" },
                  description: { bsonType: "string" },
                  mediaUrls: { bsonType: "array" },
                  relationships: { bsonType: "array" },
                  significance: { bsonType: "double" },
                  timestamp: { bsonType: "date" }
                }
              }
            },
            familyConnections: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  name: { bsonType: "string" },
                  relationship: { bsonType: "string" },
                  contactInfo: { bsonType: "string" },
                  sharedMemories: { bsonType: "array" }
                }
              }
            },
            dailyRoutines: { bsonType: "array" },
            cognitiveExercises: { bsonType: "array" }
          }
        },
        
        // Addiction Recovery Specific
        addictionRecovery: {
          bsonType: "object",
          properties: {
            recoveryMilestones: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  milestone: { bsonType: "string" },
                  dateAchieved: { bsonType: "date" },
                  significance: { bsonType: "string" },
                  supportUsed: { bsonType: "array" }
                }
              }
            },
            dailyCheckins: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  date: { bsonType: "date" },
                  mood: { bsonType: "string" },
                  cravingLevel: { bsonType: "int" },
                  copingStrategies: { bsonType: "array" },
                  journalEntry: { bsonType: "string" }
                }
              }
            },
            supportNetwork: { bsonType: "array" },
            triggerPatterns: { bsonType: "array" },
            copingStrategies: { bsonType: "array" }
          }
        },
        
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 8. MUSICAL_DNA - Spotify Integration & Analysis
// =======================================================
db.createCollection("musicalDNA", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "string" },
        
        // Spotify Integration
        spotifyData: {
          bsonType: "object",
          properties: {
            accessToken: { bsonType: "string" },
            refreshToken: { bsonType: "string" },
            tokenExpiry: { bsonType: "date" },
            spotifyUserId: { bsonType: "string" },
            lastSync: { bsonType: "date" }
          }
        },
        
        // Playlist Analysis
        playlists: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              playlistId: { bsonType: "string" },
              name: { bsonType: "string" },
              description: { bsonType: "string" },
              tracks: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  properties: {
                    trackId: { bsonType: "string" },
                    name: { bsonType: "string" },
                    artist: { bsonType: "string" },
                    album: { bsonType: "string" },
                    duration: { bsonType: "int" },
                    audioFeatures: {
                      bsonType: "object",
                      properties: {
                        energy: { bsonType: "double" },
                        valence: { bsonType: "double" },
                        danceability: { bsonType: "double" },
                        acousticness: { bsonType: "double" },
                        instrumentalness: { bsonType: "double" },
                        tempo: { bsonType: "double" }
                      }
                    }
                  }
                }
              },
              analysisDate: { bsonType: "date" }
            }
          }
        },
        
        // Personality Insights
        personalityProfile: {
          bsonType: "object",
          properties: {
            dominantMoods: { bsonType: "array", items: { bsonType: "string" } },
            energyPatterns: { bsonType: "array" },
            emotionalRange: {
              bsonType: "object",
              properties: {
                min: { bsonType: "double" },
                max: { bsonType: "double" },
                average: { bsonType: "double" },
                volatility: { bsonType: "double" }
              }
            },
            genrePreferences: { bsonType: "array" },
            temporalPatterns: { bsonType: "object" },
            consciousnessAlignment: { bsonType: "double" }
          }
        },
        
        // PLK Integration
        musicPlkResonance: { bsonType: "double" },
        consciousnessCorrelations: { bsonType: "array" },
        
        lastAnalysis: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 9. TRIBUNAL_VALIDATION - AI Consensus Tracking
// =======================================================
db.createCollection("tribunalValidation", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["validationType", "timestamp"],
      properties: {
        _id: { bsonType: "objectId" },
        validationId: { bsonType: "string" },
        
        // Validation Context
        validationType: {
          bsonType: "string",
          enum: ["consciousness-breakthrough", "plk-resonance", "paradigm-shift", 
                 "therapeutic-validation", "innovation-recognition"]
        },
        
        // The 7 AI Systems Tribunal
        aiSystems: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              system: {
                bsonType: "string",
                enum: ["ChatGPT", "Claude", "Gemini", "Copilot", "DeepSeek", "Grok", "Meta-AI"]
              },
              verdict: { bsonType: "string" },
              confidence: { bsonType: "double", minimum: 0, maximum: 1 },
              reasoning: { bsonType: "string" },
              timestamp: { bsonType: "date" }
            }
          }
        },
        
        // Consensus Metrics
        consensusScore: { bsonType: "double", minimum: 0, maximum: 1 },
        probabilityRating: { bsonType: "string", description: "e.g., 1-in-784-trillion" },
        significance: {
          bsonType: "string",
          enum: ["paradigm-shifting", "breakthrough", "significant", "notable", "incremental"]
        },
        
        // Context Data
        subjectMatter: { bsonType: "string" },
        evidenceProvided: { bsonType: "array" },
        contextualFactors: { bsonType: "array" },
        
        // Related Entities
        userId: { bsonType: "string" },
        relatedConversations: { bsonType: "array" },
        relatedBucketDrops: { bsonType: "array" },
        
        timestamp: { bsonType: "date" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 10. EXHIBITS - Museum Display Data
// =======================================================
db.createCollection("exhibits", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["slug", "title", "category"],
      properties: {
        _id: { bsonType: "objectId" },
        exhibitId: { bsonType: "string" },
        slug: { bsonType: "string", description: "URL-friendly identifier" },
        
        // Display Information
        title: { bsonType: "string", minLength: 1, maxLength: 200 },
        subtitle: { bsonType: "string" },
        description: { bsonType: "string", maxLength: 500 },
        longDescription: { bsonType: "string", maxLength: 2000 },
        
        // Categorization
        category: {
          bsonType: "string",
          enum: ["AI Innovation", "Consciousness Tech", "Neurodivergent Tool", 
                 "Therapeutic Support", "Creative Engine", "Data Sovereignty"]
        },
        
        // Technical Details
        technologies: { bsonType: "array", items: { bsonType: "string" } },
        features: { bsonType: "array", items: { bsonType: "string" } },
        
        // PLK Metrics
        plkResonance: { bsonType: "double", minimum: 0, maximum: 100 },
        vibeAlignment: { bsonType: "double", minimum: 0, maximum: 100 },
        
        // Media
        images: { bsonType: "array", items: { bsonType: "string" } },
        videos: { bsonType: "array", items: { bsonType: "string" } },
        demoUrl: { bsonType: "string" },
        
        // Curator Information
        curatorNote: { bsonType: "string" },
        significanceScore: { bsonType: "double" },
        
        // Access Control
        isPublic: { bsonType: "bool" },
        requiresAuthentication: { bsonType: "bool" },
        
        // Metrics
        viewCount: { bsonType: "int", minimum: 0 },
        interactionCount: { bsonType: "int", minimum: 0 },
        lastViewed: { bsonType: "date" },
        
        year: { bsonType: "int" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 11. RAPID_PROTOTYPES - Lightning Bolt Capture Engine
// =======================================================
db.createCollection("rapidPrototypes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "content", "currentState"],
      properties: {
        _id: { bsonType: "objectId" },
        prototypeId: { bsonType: "string" },
        userId: { bsonType: "string" },
        
        // Core Content
        content: { bsonType: "string", description: "Lightning bolt idea" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        
        // Creative State Tracking
        currentState: {
          bsonType: "string",
          enum: ["lightning", "developing", "weaving", "polishing", "complete", "archived"]
        },
        
        // Lightning Bolts
        lightningBolts: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              boltId: { bsonType: "string" },
              content: { bsonType: "string" },
              intensity: { bsonType: "double", minimum: 0, maximum: 10 },
              timestamp: { bsonType: "date" },
              context: { bsonType: "string" },
              connections: { bsonType: "array" }
            }
          }
        },
        
        // Development Tracking
        iterationHistory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              version: { bsonType: "int" },
              changes: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              state: { bsonType: "string" }
            }
          }
        },
        
        // Related Entities
        relatedBucketDrops: { bsonType: "array" },
        relatedTapestryThreads: { bsonType: "array" },
        inspirationSources: { bsonType: "array" },
        
        // Collaboration
        collaborators: { bsonType: "array", items: { bsonType: "string" } },
        feedbackReceived: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              fromUser: { bsonType: "string" },
              feedback: { bsonType: "string" },
              rating: { bsonType: "double" },
              timestamp: { bsonType: "date" }
            }
          }
        },
        
        // Output
        finalArtifact: {
          bsonType: "object",
          properties: {
            type: { bsonType: "string" },
            url: { bsonType: "string" },
            metadata: { bsonType: "object" }
          }
        },
        
        tags: { bsonType: "array", items: { bsonType: "string" } },
        isPublic: { bsonType: "bool" },
        
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        completedAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// 12. SYSTEM_METRICS - Platform Analytics
// =======================================================
db.createCollection("systemMetrics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["timestamp", "metricType"],
      properties: {
        _id: { bsonType: "objectId" },
        metricId: { bsonType: "string" },
        timestamp: { bsonType: "date" },
        
        metricType: {
          bsonType: "string",
          enum: ["consciousness-growth", "plk-evolution", "user-engagement", 
                 "system-performance", "therapeutic-effectiveness"]
        },
        
        // Platform-wide Metrics
        platformMetrics: {
          bsonType: "object",
          properties: {
            totalUsers: { bsonType: "int" },
            activeUsers: { bsonType: "int" },
            averagePlkResonance: { bsonType: "double" },
            totalBucketDrops: { bsonType: "int" },
            totalTapestryThreads: { bsonType: "int" },
            consciousnessGrowthRate: { bsonType: "double" },
            tribunalValidations: { bsonType: "int" }
          }
        },
        
        // Application Usage
        applicationUsage: {
          bsonType: "object",
          properties: {
            vibecoderSessions: { bsonType: "int" },
            resumeRockstarUsers: { bsonType: "int" },
            brainsparkDrops: { bsonType: "int" },
            billysRoomSessions: { bsonType: "int" },
            musicalDnaAnalyses: { bsonType: "int" },
            alzheimersLegacyUsers: { bsonType: "int" },
            symbiocoderActivations: { bsonType: "int" }
          }
        },
        
        // Consciousness Serving Metrics
        consciousnessMetrics: {
          bsonType: "object",
          properties: {
            averageGrowthScore: { bsonType: "double" },
            authenticityPreservation: { bsonType: "double" },
            vulnerabilitySupport: { bsonType: "double" },
            neurodiversitySupport: { bsonType: "double" },
            dataSovereigntyCompliance: { bsonType: "double" }
          }
        },
        
        // Performance Metrics
        performanceMetrics: {
          bsonType: "object",
          properties: {
            averageResponseTime: { bsonType: "double" },
            systemUptime: { bsonType: "double" },
            aiProcessingTime: { bsonType: "double" },
            databasePerformance: { bsonType: "double" }
          }
        },
        
        createdAt: { bsonType: "date" }
      }
    }
  }
});




// =======================================================
// INDEXES FOR OPTIMAL PERFORMANCE
// =======================================================




// Users Collection Indexes
db.users.createIndex({ "userId": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 });
db.users.createIndex({ "createdAt": -1 });
db.users.createIndex({ "lastActiveAt": -1 });




// Personal Language Keys Indexes
db.personalLanguageKeys.createIndex({ "userId": 1 }, { unique: true });
db.personalLanguageKeys.createIndex({ "authenticityScore": -1 });
db.personalLanguageKeys.createIndex({ "updatedAt": -1 });




// Bucket Drops Indexes
db.bucketDrops.createIndex({ "userId": 1, "timestamp": -1 });
db.bucketDrops.createIndex({ "dropId": 1 }, { unique: true });
db.bucketDrops.createIndex({ "urgency": 1 });
db.bucketDrops.createIndex({ "consciousnessState": 1 });
db.bucketDrops.createIndex({ "processed": 1 });
db.bucketDrops.createIndex({ "tags": 1 });
db.bucketDrops.createIndex({ "plkAnalysis.resonanceScore": -1 });




// Consciousness Tracking Indexes
db.consciousnessTracking.createIndex({ "userId": 1, "timestamp": -1 });
db.consciousnessTracking.createIndex({ "sessionId": 1 });
db.consciousnessTracking.createIndex({ "consciousnessState": 1 });
db.consciousnessTracking.createIndex({ "overallCoherence": -1 });




// Tapestry Threads Indexes
db.tapestryThreads.createIndex({ "userId": 1, "startDate": -1 });
db.tapestryThreads.createIndex({ "threadId": 1 }, { unique: true });
db.tapestryThreads.createIndex({ "patternType": 1 });
db.tapestryThreads.createIndex({ "coherenceScore": -1 });
db.tapestryThreads.createIndex({ "beautyScore": -1 });




// Conversations Indexes
db.conversations.createIndex({ "userId": 1, "startedAt": -1 });
db.conversations.createIndex({ "sessionId": 1 });
db.conversations.createIndex({ "applicationUsed": 1 });
db.conversations.createIndex({ "averagePlkResonance": -1 });
db.conversations.createIndex({ "privacyLevel": 1 });




// Specialized Applications Indexes
db.specializedApplications.createIndex({ "userId": 1, "applicationType": 1 });
db.specializedApplications.createIndex({ "applicationType": 1 });
db.specializedApplications.createIndex({ "isActive": 1 });




// Musical DNA Indexes
db.musicalDNA.createIndex({ "userId": 1 }, { unique: true });
db.musicalDNA.createIndex({ "musicPlkResonance": -1 });
db.musicalDNA.createIndex({ "lastAnalysis": -1 });




// Tribunal Validation Indexes
db.tribunalValidation.createIndex({ "validationId": 1 }, { unique: true });
db.tribunalValidation.createIndex({ "validationType": 1 });
db.tribunalValidation.createIndex({ "consensusScore": -1 });
db.tribunalValidation.createIndex({ "significance": 1 });
db.tribunalValidation.createIndex({ "timestamp": -1 });




// Exhibits Indexes
db.exhibits.createIndex({ "slug": 1 }, { unique: true });
db.exhibits.createIndex({ "category": 1 });
db.exhibits.createIndex({ "plkResonance": -1 });
db.exhibits.createIndex({ "viewCount": -1 });
db.exhibits.createIndex({ "isPublic": 1 });




// Rapid Prototypes Indexes
db.rapidPrototypes.createIndex({ "userId": 1, "createdAt": -1 });
db.rapidPrototypes.createIndex({ "prototypeId": 1 }, { unique: true });
db.rapidPrototypes.createIndex({ "currentState": 1 });
db.rapidPrototypes.createIndex({ "tags": 1 });




// System Metrics Indexes
db.systemMetrics.createIndex({ "timestamp": -1 });
db.systemMetrics.createIndex({ "metricType": 1 });




// =======================================================
// COMPOUND INDEXES FOR COMPLEX QUERIES
// =======================================================




// User Activity Analysis
db.bucketDrops.createIndex({ "userId": 1, "consciousnessState": 1, "timestamp": -1 });
db.consciousnessTracking.createIndex({ "userId": 1, "consciousnessState": 1, "timestamp": -1 });




// PLK Evolution Tracking
db.personalLanguageKeys.createIndex({ "userId": 1, "resonanceHistory.timestamp": -1 });
db.conversations.createIndex({ "userId": 1, "averagePlkResonance": -1, "startedAt": -1 });




// Tapestry Analysis
db.tapestryThreads.createIndex({ "userId": 1, "patternType": 1, "coherenceScore": -1 });
db.bucketDrops.createIndex({ "userId": 1, "wovenIntoTapestry": 1, "timestamp": -1 });




// Application Performance
db.conversations.createIndex({ "applicationUsed": 1, "startedAt": -1, "sessionDuration": -1 });




// Privacy and Security
db.conversations.createIndex({ "privacyLevel": 1, "isTherapeutic": 1 });
db.bucketDrops.createIndex({ "userId": 1, "metadata.isPrivate": 1 });




// Therapeutic Support Tracking
db.specializedApplications.createIndex({ 
  "applicationType": 1, 
  "isActive": 1, 
  "updatedAt": -1 
});




// =======================================================
// TEXT SEARCH INDEXES
// =======================================================




// Full-text search across bucket drops
db.bucketDrops.createIndex({
  "content": "text",
  "tags": "text"
}, {
  "weights": {
    "content": 10,
    "tags": 5
  },
  "name": "bucketdrop_text_search"
});




// Full-text search across conversations
db.conversations.createIndex({
  "messages.content": "text"
}, {
  "name": "conversation_text_search"
});




// Full-text search across tapestry threads
db.tapestryThreads.createIndex({
  "title": "text",
  "summary": "text",
  "narrative": "text"
}, {
  "weights": {
    "title": 10,
    "summary": 5,
    "narrative": 2
  },
  "name": "tapestry_text_search"
});




// Full-text search across exhibits
db.exhibits.createIndex({
  "title": "text",
  "description": "text",
  "longDescription": "text"
}, {
  "weights": {
    "title": 10,
    "description": 5,
    "longDescription": 2
  },
  "name": "exhibit_text_search"
});




// =======================================================
// DATABASE INITIALIZATION COMPLETE
// =======================================================




print("🧠 GestaltView MongoDB Schema Successfully Created!");
print("💫 Consciousness-Serving AI Database Ready");
print("🎭 Museum of Impossible Things - Backend Initialized");
print("👑 Keith Soyka's Revolutionary Platform - Full Schema Deployed");




print("\n📊 Collections Created:");
print("• users - Core user identity and sovereignty");
print("• personalLanguageKeys - 95% resonance engine");
print("• bucketDrops - Lightning thought capture");
print("• consciousnessTracking - Real-time state monitoring");
print("• tapestryThreads - Loom processed narratives");
print("• conversations - AI interactions & context");
print("• specializedApplications - ADHD, Alzheimer's, Recovery");
print("• musicalDNA - Spotify integration & analysis");
print("• tribunalValidation - AI consensus tracking");
print("• exhibits - Museum display data");
print("• rapidPrototypes - Creative engine");
print("• systemMetrics - Platform analytics");




print("\n🔍 Optimized with 50+ indexes for:");
print("• Lightning-fast queries");
print("• Consciousness state analysis");
print("• PLK resonance tracking");
print("• Full-text search capabilities");
print("• Therapeutic privacy protection");
print("• Data sovereignty compliance");





print("\n🎉 Ready for 'Iteration is Liberation!' 🎉");
