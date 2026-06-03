import { Hono } from "hono";
import { getDb } from "./queries/connection";
import {
  projects,
  services,
  stackItems,
  experiences,
  messages,
  configs,
  activities,
} from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

const api = new Hono();

// ========== PROJECTS ==========
api.get("/projects", async (c) => {
  const db = getDb();
  const data = await db.select().from(projects).orderBy(desc(projects.createdAt));
  return c.json(data);
});

api.post("/projects", async (c) => {
  const db = getDb();
  const body = await c.req.json();
  await db.insert(projects).values(body);
  await db.insert(activities).values({ action: "Creo", entity: `Proyecto: ${body.title}`, status: "Exito" });
  return c.json({ success: true });
});

api.put("/projects/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  await db.update(projects).set(body).where(eq(projects.id, id));
  return c.json({ success: true });
});

api.delete("/projects/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  await db.delete(projects).where(eq(projects.id, id));
  return c.json({ success: true });
});

// ========== SERVICES ==========
api.get("/services", async (c) => {
  const db = getDb();
  const data = await db.select().from(services).orderBy(services.order);
  return c.json(data);
});

api.post("/services", async (c) => {
  const db = getDb();
  const body = await c.req.json();
  await db.insert(services).values(body);
  return c.json({ success: true });
});

api.put("/services/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  await db.update(services).set(body).where(eq(services.id, id));
  return c.json({ success: true });
});

api.delete("/services/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  await db.delete(services).where(eq(services.id, id));
  return c.json({ success: true });
});

// ========== STACK ==========
api.get("/stack", async (c) => {
  const db = getDb();
  const data = await db.select().from(stackItems).orderBy(desc(stackItems.level));
  return c.json(data);
});

api.post("/stack", async (c) => {
  const db = getDb();
  const body = await c.req.json();
  await db.insert(stackItems).values(body);
  return c.json({ success: true });
});

api.put("/stack/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  await db.update(stackItems).set(body).where(eq(stackItems.id, id));
  return c.json({ success: true });
});

api.delete("/stack/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  await db.delete(stackItems).where(eq(stackItems.id, id));
  return c.json({ success: true });
});

// ========== EXPERIENCES ==========
api.get("/experiences", async (c) => {
  const db = getDb();
  const data = await db.select().from(experiences).orderBy(desc(experiences.createdAt));
  return c.json(data);
});

api.post("/experiences", async (c) => {
  const db = getDb();
  const body = await c.req.json();
  await db.insert(experiences).values(body);
  return c.json({ success: true });
});

api.put("/experiences/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  await db.update(experiences).set(body).where(eq(experiences.id, id));
  return c.json({ success: true });
});

api.delete("/experiences/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  await db.delete(experiences).where(eq(experiences.id, id));
  return c.json({ success: true });
});

// ========== MESSAGES ==========
api.get("/messages", async (c) => {
  const db = getDb();
  const data = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return c.json(data);
});

api.post("/messages", async (c) => {
  const db = getDb();
  const body = await c.req.json();
  await db.insert(messages).values({ ...body, read: false });
  return c.json({ success: true });
});

api.put("/messages/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  await db.update(messages).set(body).where(eq(messages.id, id));
  return c.json({ success: true });
});

api.delete("/messages/:id", async (c) => {
  const db = getDb();
  const id = Number(c.req.param("id"));
  await db.delete(messages).where(eq(messages.id, id));
  return c.json({ success: true });
});

// ========== CONFIGS ==========
api.get("/configs", async (c) => {
  const db = getDb();
  const data = await db.select().from(configs);
  return c.json(data);
});

api.get("/configs/:key", async (c) => {
  const db = getDb();
  const key = c.req.param("key");
  const result = await db.select().from(configs).where(eq(configs.key, key));
  return c.json(result[0] || null);
});

api.post("/configs", async (c) => {
  const db = getDb();
  const body = await c.req.json();
  const existing = await db.select().from(configs).where(eq(configs.key, body.key));
  if (existing.length > 0) {
    await db.update(configs).set({ value: body.value }).where(eq(configs.key, body.key));
  } else {
    await db.insert(configs).values(body);
  }
  return c.json({ success: true });
});

// ========== ACTIVITIES ==========
api.get("/activities", async (c) => {
  const db = getDb();
  const data = await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(20);
  return c.json(data);
});

// ========== STATS ==========
api.get("/stats", async (c) => {
  const db = getDb();
  const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
  const [serviceCount] = await db.select({ count: sql<number>`count(*)` }).from(services);
  const [messageCount] = await db.select({ count: sql<number>`count(*)` }).from(messages).where(eq(messages.read, false));
  const [stackCount] = await db.select({ count: sql<number>`count(*)` }).from(stackItems).where(eq(stackItems.featured, true));
  return c.json({
    projects: projectCount.count,
    services: serviceCount.count,
    newMessages: messageCount.count,
    featuredStack: stackCount.count,
  });
});

// ========== SEED ==========
api.post("/seed", async (c) => {
  const db = getDb();
  
  // Check if already seeded
  const existingProjects = await db.select().from(projects);
  if (existingProjects.length > 0) {
    return c.json({ success: true, message: "Already seeded" });
  }

  await db.insert(projects).values([
    { title: "E-commerce Local", category: "Web", status: "Publicado", description: "Plataforma de comercio electrónico.", techs: "React,Node.js,MongoDB", featured: true },
    { title: "App Delivery", category: "Mobile", status: "Publicado", description: "App tipo delivery.", techs: "Flutter,Firebase", featured: true },
    { title: "Asistente IA", category: "IA / ML", status: "Publicado", description: "Chatbot con NLP.", techs: "Python,TensorFlow", featured: false },
    { title: "POS Restaurant", category: "Desktop", status: "Borrador", description: "Sistema punto de venta.", techs: "Electron,SQLite", featured: false },
  ]);

  await db.insert(services).values([
    { title: "Desarrollo Web Full Stack", description: "React, Vue, Angular, Node.js, Python.", order: 1 },
    { title: "Apps Móviles", description: "Flutter, React Native, Kotlin, Swift.", order: 2 },
    { title: "Desktop Multiplataforma", description: "Windows, Linux, Mac. Electron, Tauri, Qt.", order: 3 },
    { title: "Inteligencia Artificial", description: "Agentes IA, chatbots, NLP.", order: 4 },
    { title: "Consultoría y Soporte", description: "Asesoramiento técnico y DevOps.", order: 5 },
  ]);

  await db.insert(stackItems).values([
    { name: "React", category: "Frontend", level: 95, color: "#61DAFB", featured: true },
    { name: "Node.js", category: "Backend", level: 90, color: "#339933", featured: true },
    { name: "Python", category: "Lenguaje", level: 88, color: "#3776AB", featured: true },
    { name: "Flutter", category: "Mobile", level: 85, color: "#02569B", featured: true },
    { name: "Docker", category: "DevOps", level: 80, color: "#2496ED", featured: false },
    { name: "PostgreSQL", category: "Database", level: 82, color: "#336791", featured: false },
    { name: "TensorFlow", category: "IA / ML", level: 75, color: "#FF6F00", featured: false },
    { name: "Linux", category: "DevOps", level: 85, color: "#FCC624", featured: false },
  ]);

  await db.insert(experiences).values([
    { type: "work", company: "Freelance / Autónomo", role: "Developer Full Stack", period: "2021 - Presente", current: true, description: "Desarrollo de soluciones para clientes internacionales." },
    { type: "education", company: "Universidad / Autodidacta", role: "Ingeniería Informática", period: "2018 - 2022", current: false, description: "Formación en desarrollo de software y sistemas distribuidos." },
  ]);

  await db.insert(messages).values([
    { name: "Carlos Méndez", email: "cmendez@ejemplo.com", subject: "Proyecto Web", message: "Hola Jesús, me interesa contratarte para desarrollar una tienda online. Necesito algo moderno con React y Node.js. ¿Podemos agendar una llamada?", read: false },
    { name: "Ana Rodríguez", email: "ana.r@empresa.com", subject: "App Móvil", message: "Necesitamos una aplicación de delivery. ¿Cuánto tiempo tomaría? Tenemos un presupuesto de $5000.", read: true },
  ]);

  return c.json({ success: true, message: "Data seeded" });
});

export default api;
