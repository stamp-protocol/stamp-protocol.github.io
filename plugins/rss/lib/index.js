const RSS = require("rss")
const url = require("url")

module.exports = (options = {}) => {
  const { feedOptions, limit, encoding, destination, collection } = {
    feedOptions: {},
    limit: 20,
    encoding: "utf8",
    destination: "rss.xml",
    collection: "posts",
    ...options,
  }

  return function(files, metalsmith, done) {
    if (!feedOptions.site_url) {
      return done(new Error("feedOptions.site_url must be configured"))
    }

    if (feedOptions.feed_url == null) {
      feedOptions.feed_url = url.resolve(feedOptions.site_url, destination)
    }

    if (typeof limit !== "number") {
      return done(new Error("limit must be a number"))
    }

    const metadata = metalsmith.metadata()

    if (!metadata.collections) {
      return done(
        new Error("no collections configured - see metalsmith-collections"),
      )
    }

    if (!metadata.collections[collection].length) {
      return done(
        new Error(
          `no item in collections '${collection}' - see metalsmith-collections`,
        ),
      )
    }

    const feed = new RSS(feedOptions)
    const collectionItems = metadata.collections[collection].slice(0, limit)

    collectionItems.forEach(item => {
      feed.item({
        description: item.contents,
        ...item,
        url: item.url ? url.resolve(feedOptions.site_url, item.url) : undefined,
      })
    })

    files[destination] = {
      contents: new Buffer(
        feed.xml({
          indent: true,
        }),
        encoding,
      ),
    }

    return done()
  }
}
