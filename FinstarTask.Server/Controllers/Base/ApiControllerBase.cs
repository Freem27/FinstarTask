using Microsoft.AspNetCore.Mvc;

namespace FinstarTask.Server.Controllers.Base;

[ApiController]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None, Duration = 0)]
public class ApiControllerBase : ControllerBase
{
    protected IActionResult Success<T>(T data) where T : class
    {
        return Ok(new ApiResponse<T>
        {
            Success = true,
            Data = data
        });
    }

    protected IActionResult Error(string message)
    {
        return Ok(new ApiResponse<object>()
        {
            Success = false,
            Message = message
        });
    }
}
