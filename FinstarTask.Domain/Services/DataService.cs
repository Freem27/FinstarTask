using FinstarTask.Domain.Models;
using FinstarTask.DAL.Repos;
using FinstarTask.DAL.Entities;
using FinstarTask.DAL;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;

namespace FinstarTask.Domain.Services;

public interface IDataService
{
    Task<PagedResult<FinstarRow>> GetPage(int page, int pageSize);
    Task SetNewData(IEnumerable<NewFinstarRow> newItems);
}

public class DataService : IDataService
{
    private readonly BaseRepo<FinstarRowDbEntity> _finstarRepo;
    private readonly ILogger<DataService> _logger;

    public DataService(BaseRepo<FinstarRowDbEntity> finstarRepo, ILogger<DataService> logger)
    {
        _finstarRepo = finstarRepo;
        _logger = logger;
    }

    public async Task<PagedResult<FinstarRow>> GetPage(int page, int pageSize)
    {
        using var transaction = await _finstarRepo.BeginTransactionAsync(IsolationLevel.RepeatableRead);
        return await _finstarRepo.GetAll().GetPage(r => r.RowNum * -1, page, pageSize, r => new FinstarRow
        {
            Code = r.Code,
            Value = r.Value,
            RowNum = r.RowNum
        });
    }

    public async Task SetNewData(IEnumerable<NewFinstarRow> newItems)
    {
        using IDbContextTransaction transaction = await _finstarRepo.BeginTransactionAsync(IsolationLevel.Serializable);
        try
        {
            await _finstarRepo.TruncateAsync();
            await _finstarRepo.BulkInsertAsync(
                newItems.Select((i,index) => new FinstarRowDbEntity {RowNum = index, Code = i.Code, Value = i.Value })
                .OrderBy(i => i.Code).ThenBy(i => i.Value)
            );
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, null);
            await transaction.RollbackAsync();
            throw new HumanApiException("Ошибка при обнолении данных");
        }
    }
}
