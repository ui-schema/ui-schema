import { routes } from '../src/routes'
import { generateSitemap } from '@control-ui/routes/generateSitemap'
import * as path from 'path'
import * as fs from 'fs'

const args = process.argv
args.splice(0, 2)
const hostname = args[0]
const dist = args[1]

if(!hostname || !dist) {
    console.error('hostname and dist must be set `node sitemap.js https://example.org ./sitemap.xml`')
    process.exit(1)
}

console.log('Building sitemap for host ' + hostname)

const routing = routes(() => () => null)
const sitemapUrls = generateSitemap(
    hostname,
    routing,
    (r) => typeof r.path === 'string' && !r.routes,
    'weekly',
)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('')}
</urlset>`


fs.writeFile(path.resolve(dist), sitemap, (err) => {
    if(err) {
        console.error('Failed saving sitemap to ' + path.resolve(dist), err)
        return
    }

    console.log('Saved sitemap with ' + sitemapUrls.length + ' urls in ' + path.resolve(dist))
})
