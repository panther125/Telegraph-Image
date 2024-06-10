export async function onRequest(context) {
    // Contents of context object
    const {
      request, // same as existing Worker API
      env, // same as existing Worker API
      params, // if filename includes [id] or [[path]]
      waitUntil, // same as ctx.waitUntil in existing Worker API
      next, // used for middleware or to fetch assets
      data, // arbitrary space for passing data between middlewares
    } = context;
    console.log(env)
    const value = await env.img_url.list();
    const url = new URL(request.url);
    if(url.searchParams.get("count") === 'all'){
        const response = {
            count: value.keys.length, // Total number of items
            datalist: value, // Paginated data list
        };
        const info = JSON.stringify(response);
        return new Response(info);
    }
    const start = parseInt(url.searchParams.get("start")) || 0;
    const count = parseInt(url.searchParams.get("count")) || 10;
    const offset = start * count;
    const paginatedKeys = value.keys.slice(offset, offset + count);
    const res = paginatedKeys.map(key => ({
        name: key.name,
        TimeStamp: key.metadata?.TimeStamp,
        ListType: key.metadata?.ListType,
        rating_label: key.metadata?.rating_label,
    }));
    //console.log(res)
    const response = {
        count: value.keys.length, // Total number of items
        datalist: res, // Paginated data list
    };
    const info = JSON.stringify(response);
    return new Response(info);
  }
