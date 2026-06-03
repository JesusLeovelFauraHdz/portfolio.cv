import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

// Users table (from auth)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Portfolio Configuration
export const configs = mysqlTable("configs", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Config = typeof configs.$inferSelect;
export type InsertConfig = typeof configs.$inferInsert;

// Projects
export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["Publicado", "Borrador", "Archivado"]).default("Borrador").notNull(),
  image: text("image"),
  imageLocal: text("imageLocal"),
  demo: text("demo"),
  repo: text("repo"),
  description: text("description"),
  techs: text("techs"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Services
export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// Tech Stack
export const stackItems = mysqlTable("stack_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  level: int("level").default(0),
  color: varchar("color", { length: 20 }).default("#2563eb"),
  logo: text("logo"),
  logoLocal: text("logoLocal"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type StackItem = typeof stackItems.$inferSelect;
export type InsertStackItem = typeof stackItems.$inferInsert;

// Experience (Work & Education)
export const experiences = mysqlTable("experiences", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["work", "education"]).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  period: varchar("period", { length: 100 }),
  current: boolean("current").default(false),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

// Messages (Contact form submissions)
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Activity Log
export const activities = mysqlTable("activities", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 100 }).notNull(),
  entity: varchar("entity", { length: 255 }).notNull(),
  status: varchar("status", { length: 100 }).default("Exito"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;
