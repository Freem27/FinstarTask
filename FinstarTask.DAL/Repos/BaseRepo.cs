using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace FinstarTask.DAL.Repos;

public class BaseRepo<TEntity> where TEntity : class
{
    protected readonly ApplicationDbContext _context;

    public BaseRepo(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TEntity> CreateAsync(TEntity entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException($"{nameof(entity)} is null");
        }
        await _context.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<TEntity>> CreateAsync(IEnumerable<TEntity> entities)
    {
        if (entities == null)
        {
            throw new ArgumentNullException($"{nameof(entities)} is null");
        }
        await _context.AddRangeAsync(entities);
        await _context.SaveChangesAsync();
        return entities;
    }

    public async Task<TEntity> DeleteAsync(TEntity entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException($"{nameof(entity)} is null");
        }
        _context.Remove(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IEnumerable<TEntity>> DeleteAsync(IEnumerable<TEntity> entities)
    {
        if (entities == null)
        {
            throw new ArgumentNullException($"{nameof(entities)} is null");
        }
        _context.RemoveRange(entities);
        await _context.SaveChangesAsync();
        return entities;
    }

    public async Task TruncateAsync()
    {
        await _context.TruncateAsync<TEntity>();
    }

    public IQueryable<TEntity> GetAll()
    {
        return _context.Set<TEntity>();
    }

    public async Task<TEntity> UpdateAsync(TEntity entity)
    {
        if (entity == null)
        {
            throw new ArgumentNullException($"{nameof(entity)} is null");
        }
        _context.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<IDbContextTransaction> BeginTransactionAsync()
    {
        IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();
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

    public void TurnOffTracking(TEntity entity)
    {
        _context.Entry(entity).State = EntityState.Detached;
    }
}
