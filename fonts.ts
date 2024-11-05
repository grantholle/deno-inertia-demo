import { basename } from "@std/path";

const manifestRes = await fetch("https://v2.inertiajs.com/build/manifest.json");
const manifest = await manifestRes.json();

for (let path in manifest) {
  if (path.endsWith("woff") || path.endsWith("woff2")) {
    const font = await fetch(
      "https://v2.inertiajs.com/build/" + manifest[path].file,
    );
    const data = new Uint8Array(await font.arrayBuffer());
    await Deno.writeFile("./fonts/" + basename(path), data);
  }
}
