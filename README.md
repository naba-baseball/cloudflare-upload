# This is no longer used

The file size got too big for the worker.

---

create a wrangler.toml file like this
```
[[r2_buckets]]
binding = "ROSTER_BUCKET"
bucket_name = "your-r2-bucket-name"
```

```
npm install
npm run dev
```

```
npm run deploy
```
