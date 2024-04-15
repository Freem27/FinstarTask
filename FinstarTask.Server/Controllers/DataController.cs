using FinstarTask.Domain.Services;
using FinstarTask.Server.Controllers.Base;
using FinstarTask.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace FinstarTask.Server.Controllers;


[ApiController]
[Route("api/[controller]")]
public class DataController : ApiControllerBase
{
    private readonly IDataService _dataService;

    public DataController(IDataService dataService)
    {
        _dataService = dataService;
    }
    
    [Route("TruncateAndInsert")]
    [HttpPost]
    public async Task<IActionResult> TruncateAndInsert([FromBody] SetNewDataRequest model)
    {
        await _dataService.SetNewData(model.Items);
        return await Get(1, model.PageSize);
    }

    [Route("Get")]
    [HttpGet]
    public async Task<IActionResult> Get(int page = 1, int pageSize = 10)
    {
        var resp = await _dataService.GetPage(page, pageSize);
        return Success(resp);
    }
}
