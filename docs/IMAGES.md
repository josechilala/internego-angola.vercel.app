# Service images

Assets supplied in the root imagens folder were visually reviewed and moved to public/imagens. Paths are lowercase and work on Vercel's case-sensitive filesystem. Original JPEG bytes are retained; next/image provides responsive sizes, lazy loading below the fold and optimized delivery.

| Original filename | Public path under /imagens/ | Classification and use |
| --- | --- | --- |
| 87e19688-f017-4e8e-8b0c-ca51ee3edbd5.JPG | seguranca-privada/equipa-seguranca.jpg | Security team: home hero |
| 57da1300-576a-487d-acad-4a17a209ecdb.JPG | seguranca-privada/videovigilancia.jpg | CCTV: security service section; camera framing |
| e2b49205-410c-4f51-aea6-9f2a54035535.JPG | gestao-residuos/recolha-residuos.jpg | Waste collection: home hero |
| f99587b7-f729-4f09-8692-fe96f2452a3c.JPG | gestao-residuos/equipa-recolha.jpg | Waste collection crew: waste service section |
| 9eda5927-62f9-48ab-a7d0-760e0c51f214.JPG | gestao-residuos/capina.jpg | Vegetation clearing: retained, not displayed |
| a3353717-561d-46ca-bd07-68266ec4b160.JPG | gestao-residuos/limpeza-urbana.jpg | Urban cleaning: retained, not displayed |
| c7407f25-cfc3-44c8-8895-d2c9374b3220.JPG | gestao-residuos/camiao-recolha.jpg | Collection truck banner: retained, not displayed |
| 6d8fd40b-b680-4448-a648-733c065e85e9.JPG | institucional/duas-divisoes.jpg | Both divisions: retained, not used in either service section |

Existing logos are preserved byte-for-byte from Git: 9.jpeg becomes logotipos/internego.jpg, 8.jpeg becomes logotipos/seguranca.jpg and 7.jpeg becomes logotipos/residuos.jpg. The header, footer, hero division badges and About section use these public paths.

The existing services are sections on the home page (/#seguranca and /#residuos), not separate routes. No new service pages were introduced. The old /media route and tracing configuration were removed after all component references migrated to public assets. Previously removed root images have no remaining source references. Supabase project photographs, image API and admin behavior are unchanged.
