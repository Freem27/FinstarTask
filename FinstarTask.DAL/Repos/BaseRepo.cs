using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;

namespace FinstarTask.DAL.Repos;

public class BaseRepo<TEntity> where TEntity : class
{
    protected readonly ApplicationDbContext _context;

    public BaseRepo(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task TruncateAsync()
    {
        await _context.TruncateAsync<TEntity>();
    }

    public IQueryable<TEntity> GetAll()
    {
        return _context.Set<TEntity>();
    }

    public async Task<IDbContextTransaction> BeginTransactionAsync(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
    {
        IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync(isolationLevel);
        return transaction;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="entities"></param>
    /// <param name="bulkConfig">new EFCore.BulkExtensions.BulkConfig { SetOutputIdentity = true } for return identity</param>
    /// <returns></returns>
    public async Task BulkInsertAsync(IEnumerable<TEntity> entities, BulkConfig? bulkConfig = null)
    {
        await _context.BulkInsertAsync(entities, bulkConfig);
        await _context.SaveChangesAsync();
    }
}
