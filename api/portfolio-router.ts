import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
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
import { eq, desc, like, and, sql } from "drizzle-orm";

export const portfolioRouter = createRouter({
  // ========== PROJECTS ==========
  projectList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }),
  projectCreate: publicQuery
    .input(z.object({
      title: z.string().min(1),
      category: z.string().default("Web"),
      status: z.enum(["Publicado", "Borrador", "Archivado"]).default("Borrador"),
      image: z.string().optional(),
      imageLocal: z.string().optional(),
      demo: z.string().optional(),
      repo: z.string().optional(),
      description: z.string().optional(),
      techs: z.string().optional(),
      featured: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(projects).values({
        ...input,
        techs: input.techs || "",
      });
      await db.insert(activities).values({
        action: "Creo",
        entity: `Proyecto: ${input.title}`,
        status: "Exito",
      });
      return { success: true };
    }),
  projectUpdate: publicQuery
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      category: z.string().optional(),
      status: z.enum(["Publicado", "Borrador", "Archivado"]).optional(),
      image: z.string().optional(),
      imageLocal: z.string().optional(),
      demo: z.string().optional(),
      repo: z.string().optional(),
      description: z.string().optional(),
      techs: z.string().optional(),
      featured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(projects).set(data).where(eq(projects.id, id));
      await db.insert(activities).values({
        action: "Edito",
        entity: `Proyecto: ${input.title || `#${id}`}`,
        status: "Exito",
      });
      return { success: true };
    }),
  projectDelete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(projects).where(eq(projects.id, input.id));
      await db.insert(activities).values({
        action: "Elimino",
        entity: `Proyecto #${input.id}`,
        status: "Exito",
      });
      return { success: true };
    }),

  // ========== SERVICES ==========
  serviceList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(services).orderBy(services.order);
  }),
  serviceCreate: publicQuery
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(services).values(input);
      return { success: true };
    }),
  serviceUpdate: publicQuery
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(services).set(data).where(eq(services.id, id));
      return { success: true };
    }),
  serviceDelete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(services).where(eq(services.id, input.id));
      return { success: true };
    }),

  // ========== STACK ==========
  stackList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(stackItems).orderBy(desc(stackItems.level));
  }),
  stackCreate: publicQuery
    .input(z.object({
      name: z.string().min(1),
      category: z.string().default("Frontend"),
      level: z.number().min(0).max(100).default(0),
      color: z.string().default("#2563eb"),
      logo: z.string().optional(),
      logoLocal: z.string().optional(),
      featured: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(stackItems).values(input);
      return { success: true };
    }),
  stackUpdate: publicQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      category: z.string().optional(),
      level: z.number().min(0).max(100).optional(),
      color: z.string().optional(),
      logo: z.string().optional(),
      logoLocal: z.string().optional(),
      featured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(stackItems).set(data).where(eq(stackItems.id, id));
      return { success: true };
    }),
  stackDelete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(stackItems).where(eq(stackItems.id, input.id));
      return { success: true };
    }),

  // ========== EXPERIENCES ==========
  experienceList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(experiences).orderBy(desc(experiences.createdAt));
  }),
  experienceCreate: publicQuery
    .input(z.object({
      type: z.enum(["work", "education"]),
      company: z.string().min(1),
      role: z.string().min(1),
      period: z.string().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(experiences).values(input);
      return { success: true };
    }),
  experienceUpdate: publicQuery
    .input(z.object({
      id: z.number(),
      type: z.enum(["work", "education"]).optional(),
      company: z.string().min(1).optional(),
      role: z.string().min(1).optional(),
      period: z.string().optional(),
      current: z.boolean().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(experiences).set(data).where(eq(experiences.id, id));
      return { success: true };
    }),
  experienceDelete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(experiences).where(eq(experiences.id, input.id));
      return { success: true };
    }),

  // ========== MESSAGES ==========
  messageList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(messages).orderBy(desc(messages.createdAt));
  }),
  messageCreate: publicQuery
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      subject: z.string().optional(),
      message: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(messages).values({ ...input, read: false });
      return { success: true };
    }),
  messageUpdate: publicQuery
    .input(z.object({
      id: z.number(),
      read: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(messages).set({ read: input.read }).where(eq(messages.id, input.id));
      return { success: true };
    }),
  messageDelete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(messages).where(eq(messages.id, input.id));
      return { success: true };
    }),

  // ========== CONFIGS ==========
  configList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(configs);
  }),
  configGet: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(configs).where(eq(configs.key, input.key));
      return result[0] || null;
    }),
  configSet: publicQuery
    .input(z.object({
      key: z.string(),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(configs).where(eq(configs.key, input.key));
      if (existing.length > 0) {
        await db.update(configs).set({ value: input.value }).where(eq(configs.key, input.key));
      } else {
        await db.insert(configs).values(input);
      }
      return { success: true };
    }),

  // ========== ACTIVITIES ==========
  activityList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(activities).orderBy(desc(activities.createdAt)).limit(20);
  }),

  // ========== STATS ==========
  stats: publicQuery.query(async () => {
    const db = getDb();
    const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const [serviceCount] = await db.select({ count: sql<number>`count(*)` }).from(services);
    const [messageCount] = await db.select({ count: sql<number>`count(*)` }).from(messages).where(eq(messages.read, false));
    const [stackCount] = await db.select({ count: sql<number>`count(*)` }).from(stackItems).where(eq(stackItems.featured, true));
    return {
      projects: projectCount.count,
      services: serviceCount.count,
      newMessages: messageCount.count,
      featuredStack: stackCount.count,
    };
  }),
});
