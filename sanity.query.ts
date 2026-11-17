import { createClient, groq } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-03-12",
  useCdn: false,
});

// Fungsi untuk ambil data Global Settings
export async function getSettings() {
  return client.fetch(
    groq`*[_type == "settings"][0]{
      heroTitleWhite,
      heroTitleGold,
      emailContact,
      officeLocation
    }`
  );
}

// Fungsi untuk ambil data Portfolio
export async function getProjects() {
  return client.fetch(
    groq`*[_type == "portfolio"]{
      _id,
      title,
      "image": image.asset->url,
      category,
      description
    }`
  );
}

// Fungsi untuk ambil data Services
export async function getServices() {
  return client.fetch(
    groq`*[_type == "services"] | order(order asc) {
      _id,
      serviceName,
      description,
      features,
      order
    }`
  );
}