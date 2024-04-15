using Microsoft.EntityFrameworkCore;

namespace FinstarTask.DAL;

public class PagedResult<T> where T : class
{
    public PagedResult(IEnumerable<T> items, int total, int page, int pageSize)
    {
        Items = items;
        TotalCount = total;
        Page = page;
        PageSize = pageSize;
    }

    public IEnumerable<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

public abstract class PagedRequest<TEntity, TResult>
    where TEntity : class
    where TResult : class
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public abstract Func<TEntity, object> OrderByDescFunc(TEntity entity);
    public abstract TResult ConvertFunc(TEntity entity);
}


public static class PagedResultExtensions
{
    private static async Task<Tuple<IEnumerable<TEntity>, int>> GetRawData<TEntity, TKey>(this IQueryable<TEntity> query, Func<TEntity, TKey> orderByDesc, int page, int size) where TEntity : class
    {
        query = query.AsNoTracking();
        var totalCount = await query.CountAsync();
        var items = query.OrderByDescending(orderByDesc).Skip((page - 1) * size).Take(size);
        return new Tuple<IEnumerable<TEntity>, int>(items, totalCount);
    }

    public static async Task<PagedResult<TEntity>> GetPage<TEntity, TKey>(this IQueryable<TEntity> query, Func<TEntity, TKey> orderByDesc, int page, int size) where TEntity : class
    {
        var (items, count) = await query.GetRawData(orderByDesc, page, size);
        return new PagedResult<TEntity>(items, count, page, size);
    }

    public static async Task<PagedResult<TResult>> GetPage<TResult, TEntity, TKey>(
        this IQueryable<TEntity> query,
        Func<TEntity, TKey> orderByDesc,
        int page,
        int size,
        Func<TEntity, TResult> convertFunc
    ) where TResult : class
        where TEntity : class
    {
        var (items, count) = await query.GetRawData(orderByDesc, page, size);
        return new PagedResult<TResult>(items.Select(i => convertFunc(i)), count, page, size);
    }

    public static async Task<PagedResult<TResult>> GetPage<TResult, TEntity>(
        this IQueryable<TEntity> query,
        PagedRequest<TEntity, TResult> request
    )
        where TResult : class
        where TEntity : class
    {
        var (items, count) = await query.GetRawData(request.OrderByDescFunc, request.Page, request.PageSize);
        return new PagedResult<TResult>(items.Select(request.ConvertFunc), count, request.Page, request.PageSize);
    }
}