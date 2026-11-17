"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function addMasterProduct(formData: FormData) {
  try {
    // 1. Ekstrak data dari FormData dengan aman
    const title = formData.get("title")?.toString();
    const rawPrice = formData.get("price")?.toString();
    const productUrl = formData.get("productUrl")?.toString();
    const contentUrlRaw = formData.get("contentUrl")?.toString();
    const description = formData.get("description")?.toString();

    // 2. Get file uploads
    const thumbnailFile = formData.get("thumbnail") as File;
    const assetFiles = formData.getAll("assets") as File[];

    // 3. Konversi harga ke Number
    const price = rawPrice ? parseInt(rawPrice, 10) : 0;

    // 4. Validasi Dasar (Server-side)
    if (!title || !rawPrice || isNaN(price) || !productUrl) {
      return { 
        success: false, 
        error: "Field utama wajib diisi dengan benar." 
      };
    }

    // 5. Upload thumbnail ke Supabase Storage
    let thumbnailUrl = "";
    if (thumbnailFile) {
      const fileName = `thumbnail-${Date.now()}-${thumbnailFile.name}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, thumbnailFile);
      
      if (error) {
        console.error("Thumbnail upload error:", error);
        return { success: false, error: "Failed to upload thumbnail" };
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);
      
      thumbnailUrl = publicUrl;
    }

    // 6. Upload assets ke Supabase Storage
    const assetUrls = [];
    if (assetFiles && assetFiles.length > 0) {
      for (const file of assetFiles) {
        const fileName = `asset-${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);
        
        if (error) {
          console.error("Asset upload error:", error);
          continue;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);
        
        assetUrls.push(publicUrl);
      }
    }

    // 7. Transformasi String ke Array JSON
    // Pastikan ini cocok dengan skema Prisma kamu (Json)
    const contentUrlArray = contentUrlRaw 
      ? contentUrlRaw.split(",").map(url => url.trim()).filter(url => url !== "")
      : [];

    // 8. Simpan ke Database
    await prisma.masterProduct.create({
      data: {
        title,
        price,
        thumbnail: thumbnailUrl,
        productUrl,
        contentUrl: [...contentUrlArray, ...assetUrls], 
        description: description || null,
      },
    });

    // 9. Trigger Revalidasi
    revalidatePath("/dashboard");
    revalidatePath("/affstore");
    
    return { success: true };
  } catch (error) {
    // Log error di server agar kamu bisa baca di terminal/console
    console.error("Critical Database Error:", error);
    
    // Jangan lempar (throw) error mentah-mentah ke client agar tidak "Failed to fetch"
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Terjadi kesalahan pada database." 
    };
  }
}