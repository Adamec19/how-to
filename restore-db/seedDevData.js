/*
 * Dev seed script — naplní prázdnou lokální Strapi (v5) databázi ukázkovými daty:
 *   - 3 blog post categories, 2 page categories, 4 tags, 2 release-notes categories
 *   - 1 placeholder obrázek (upload do public/uploads přes upload plugin)
 *   - 5 blog posts, 4 pages (vytvořeno jako draft, poté publikováno)
 *
 * NEDESTRUKTIVNÍ & IDEMPOTENTNÍ: nikdy nic nemaže; záznamy, které už existují
 * (podle slug/title), přeskočí — opakované spuštění je bezpečné.
 *
 * Skript bootuje Strapi programaticky z projektu direct.cz-cms, takže projdou
 * všechny validace i lifecycles (generatedUrl, duplicate checky).
 *
 * Použití (postgres kontejner musí běžet, `yarn develop` může i nemusí běžet):
 *   node seedDevData.js
 *   STRAPI_APP_DIR=/jina/cesta/strapi node seedDevData.js
 */

const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const zlib = require("node:zlib");

// Cesta ke Strapi projektu — přepiš env proměnnou STRAPI_APP_DIR, pokud se liší
const APP_DIR =
  process.env.STRAPI_APP_DIR ||
  "/Users/martin.adamec/work/direct/projects/direct.cz-cms/strapi";

// Závislosti (dotenv, @strapi/strapi) se načítají z node_modules Strapi
// projektu, aby šel skript spustit odkudkoliv.
const requireFromApp = (mod) => require(require.resolve(mod, { paths: [APP_DIR] }));

requireFromApp("dotenv").config({ path: path.join(APP_DIR, ".env") });
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const { createStrapi } = requireFromApp("@strapi/strapi");

// ---------------------------------------------------------------------------
// Placeholder PNG generator (jednobarevný, bez externích závislostí)
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([len, typeAndData, crc]);
}

/** Vytvoří jednobarevné RGB PNG dané velikosti. */
function makePng(width, height, [r, g, b]) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  // raw scanlines: filter byte 0 + RGB pixely
  const row = Buffer.alloc(1 + width * 3);
  for (let x = 0; x < width; x++) {
    row[1 + x * 3] = r;
    row[2 + x * 3] = g;
    row[3 + x * 3] = b;
  }
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Definice seed dat
// ---------------------------------------------------------------------------

const BLOG_CATEGORIES = [
  { title: "Pojištění", slug: "pojisteni", showInMenu: true, publicWeb: "DIRECT", displayLabel: "Pojištění", orderInMenu: 1 },
  { title: "Novinky", slug: "novinky", showInMenu: true, publicWeb: "DIRECT", displayLabel: "Novinky", orderInMenu: 2 },
  { title: "Tipy a triky", slug: "tipy-a-triky", showInMenu: true, publicWeb: "DIRECT", displayLabel: "Tipy a triky", orderInMenu: 3 },
];

const PAGE_CATEGORIES = [
  { Name: "Pojištění", slug: "pojisteni", generatedUrl: "/pojisteni" },
  { Name: "O nás", slug: "o-nas", generatedUrl: "/o-nas" },
];

const TAGS = [
  { name: "auto" },
  { name: "cestování" },
  { name: "majetek" },
  { name: "novinky" },
];

const RELEASE_NOTES_CATEGORIES = [
  { category: "Frontend" },
  { category: "Backend" },
];

const textComponent = (html) => ({
  __component: "page-components.text",
  text: html,
  width: "grid_8/12",
});

// categorySlug = slug blog kategorie, první kategorie určuje URL
const BLOG_POSTS = [
  {
    title: "Jak vybrat správné povinné ručení",
    slug: "jak-vybrat-spravne-povinne-ruceni",
    categorySlug: "pojisteni",
    tagNames: ["auto"],
    author: "Jan Novák",
    readTime: 5,
    perex: "<p>Povinné ručení musí mít každé auto. Jak ale vybrat to správné?</p>",
  },
  {
    title: "Cestovní pojištění na dovolenou",
    slug: "cestovni-pojisteni-na-dovolenou",
    categorySlug: "pojisteni",
    tagNames: ["cestování"],
    author: "Petra Svobodová",
    readTime: 4,
    perex: "<p>Na co si dát pozor při sjednávání cestovního pojištění.</p>",
  },
  {
    title: "Novinky v aplikaci pro klienty",
    slug: "novinky-v-aplikaci-pro-klienty",
    categorySlug: "novinky",
    tagNames: ["novinky"],
    author: "Jan Novák",
    readTime: 3,
    perex: "<p>Přinášíme přehled nejnovějších funkcí klientské aplikace.</p>",
  },
  {
    title: "Pět tipů jak ochránit domácnost",
    slug: "pet-tipu-jak-ochranit-domacnost",
    categorySlug: "tipy-a-triky",
    tagNames: ["majetek"],
    author: "Petra Svobodová",
    readTime: 6,
    perex: "<p>Praktické rady, jak předejít škodám na majetku.</p>",
  },
  {
    title: "Co dělat při dopravní nehodě",
    slug: "co-delat-pri-dopravni-nehode",
    categorySlug: "tipy-a-triky",
    tagNames: ["auto", "cestování"],
    author: "Jan Novák",
    readTime: 7,
    perex: "<p>Krok za krokem: jak postupovat po dopravní nehodě.</p>",
  },
];

// pageCategorySlug: null → stránka žije v rootu ("/slug")
const PAGES = [
  { title: "Povinné ručení", slug: "povinne-ruceni", pageCategorySlug: "pojisteni" },
  { title: "Cestovní pojištění", slug: "cestovni-pojisteni", pageCategorySlug: "pojisteni" },
  { title: "Kontakty", slug: "kontakty", pageCategorySlug: null },
  { title: "Kariéra", slug: "kariera", pageCategorySlug: null },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function findOneBy(strapi, uid, filters) {
  const results = await strapi.documents(uid).findMany({ filters, limit: 1 });
  return results?.[0] ?? null;
}

/** Vytvoří záznam, pokud už neexistuje záznam odpovídající `filters`. */
async function ensureEntry(strapi, uid, filters, data, { publish = false } = {}) {
  const existing = await findOneBy(strapi, uid, filters);
  if (existing) {
    console.log(`  ⊘ ${uid} ${JSON.stringify(filters)} already exists — skipping`);
    return existing;
  }
  const created = await strapi.documents(uid).create({ data });
  if (publish) {
    await strapi.documents(uid).publish({ documentId: created.documentId });
  }
  console.log(`  ✓ Created ${uid}: ${data.title ?? data.Name ?? data.name ?? data.category}`);
  return created;
}

async function ensurePlaceholderImage(strapi) {
  const NAME = "seed-placeholder";
  const existing = await strapi.db
    .query("plugin::upload.file")
    .findOne({ where: { name: NAME } });
  if (existing) {
    console.log(`  ⊘ Placeholder image already uploaded (id ${existing.id}) — skipping`);
    return existing;
  }

  const tmpPath = path.join(os.tmpdir(), `${NAME}-${process.pid}.png`);
  fs.writeFileSync(tmpPath, makePng(600, 400, [226, 0, 26])); // Direct red

  try {
    const stats = fs.statSync(tmpPath);
    // Obsahuje obě sady klíčů: v5 (koa-body v6 / formidable) i legacy v4 názvy,
    // aby si upload service našel ty, které očekává.
    const file = {
      filepath: tmpPath,
      path: tmpPath,
      originalFilename: `${NAME}.png`,
      name: NAME,
      mimetype: "image/png",
      type: "image/png",
      size: stats.size,
    };
    const uploaded = await strapi
      .plugin("upload")
      .service("upload")
      .upload({
        data: { fileInfo: { name: NAME, alternativeText: "Placeholder", caption: null } },
        files: file,
      });
    const result = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    console.log(`  ✓ Uploaded placeholder image (id ${result.id})`);
    return result;
  } finally {
    fs.rmSync(tmpPath, { force: true });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error(`✗ Strapi project not found at ${APP_DIR} (set STRAPI_APP_DIR)`);
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("✗ DATABASE_URL is not set (expected in strapi/.env)");
    process.exit(1);
  }

  console.log("📦 Bootstrapping Strapi...");
  process.chdir(APP_DIR);
  const app = await createStrapi({ appDir: APP_DIR, distDir: APP_DIR }).load();

  try {
    // --- categories, tags -------------------------------------------------
    console.log("\n📁 Blog post categories");
    const blogCatsBySlug = {};
    for (const cat of BLOG_CATEGORIES) {
      blogCatsBySlug[cat.slug] = await ensureEntry(
        app,
        "api::blog-post-category.blog-post-category",
        { slug: cat.slug },
        cat
      );
    }

    console.log("\n📂 Page categories");
    const pageCatsBySlug = {};
    for (const cat of PAGE_CATEGORIES) {
      pageCatsBySlug[cat.slug] = await ensureEntry(
        app,
        "api::page-category.page-category",
        { slug: cat.slug },
        cat,
        { publish: true }
      );
    }

    console.log("\n🏷️  Tags");
    const tagsByName = {};
    for (const tag of TAGS) {
      tagsByName[tag.name] = await ensureEntry(app, "api::tag.tag", { name: tag.name }, tag);
    }

    console.log("\n🗒️  Release notes categories");
    for (const cat of RELEASE_NOTES_CATEGORIES) {
      await ensureEntry(
        app,
        "api::release-notes-category.release-notes-category",
        { category: cat.category },
        cat
      );
    }

    // --- media -------------------------------------------------------------
    console.log("\n🖼️  Placeholder image");
    const image = await ensurePlaceholderImage(app);

    // --- blog posts ----------------------------------------------------------
    console.log("\n📝 Blog posts");
    for (const [i, post] of BLOG_POSTS.entries()) {
      const category = blogCatsBySlug[post.categorySlug];
      const data = {
        title: post.title,
        slug: post.slug,
        // generatedUrl přepočítá beforeCreate lifecycle; tahle hodnota jen
        // splní schema-level `required` validaci
        generatedUrl: `/blog/${post.categorySlug}/${post.slug}`,
        publicWeb: "DIRECT",
        author: post.author,
        readTime: post.readTime,
        Perex: post.perex,
        publicationDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        content: [textComponent(`${post.perex}<p>Ukázkový obsah článku pro lokální vývoj.</p>`)],
        image: image.id,
        blog_categories: { connect: [{ documentId: category.documentId }] },
        tags: {
          connect: post.tagNames.map((n) => ({ documentId: tagsByName[n].documentId })),
        },
      };
      await ensureEntry(
        app,
        "api::blog-post.blog-post",
        { slug: post.slug },
        data,
        { publish: true }
      );
    }

    // --- pages ---------------------------------------------------------------
    console.log("\n📄 Pages");
    for (const page of PAGES) {
      const data = {
        title: page.title,
        slug: page.slug,
        publicWeb: "DIRECT",
        isIndexed: true,
        content: [
          textComponent(`<h2>${page.title}</h2><p>Ukázková stránka pro lokální vývoj.</p>`),
        ],
        ...(page.pageCategorySlug
          ? {
              pageCategory: {
                connect: [{ documentId: pageCatsBySlug[page.pageCategorySlug].documentId }],
              },
            }
          : {}),
      };
      await ensureEntry(app, "api::page.page", { slug: page.slug }, data, { publish: true });
    }

    // --- normalize generated URLs -------------------------------------------
    // Publish clone nemusí nést relační `connect` payloady, proto se všechny
    // generatedUrl přepočítají z reálných relací (services v repu).
    console.log("\n🔗 Recomputing generated URLs");
    await app.service("api::page.page").updateAllGeneratedUrl();
    await app.service("api::blog-post.blog-post").updateAllGeneratedUrl();
    console.log("  ✓ Done");

    // --- summary --------------------------------------------------------------
    console.log("\n📊 Summary");
    for (const uid of [
      "api::blog-post-category.blog-post-category",
      "api::page-category.page-category",
      "api::tag.tag",
      "api::release-notes-category.release-notes-category",
      "api::blog-post.blog-post",
      "api::page.page",
    ]) {
      const count = await app.db.query(uid).count();
      console.log(`  ${uid}: ${count} row(s)`);
    }

    console.log("\n✅ Seed completed");
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
