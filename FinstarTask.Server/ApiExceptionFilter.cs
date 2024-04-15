using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using FinstarTask.Domain;
using FinstarTask.Server.Controllers.Base;

namespace FinstarTask.Server;

public class ApiExceptionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {

    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        var exception = context.Exception;
        if (exception == null)
        {
            return;
        }

        var loggerFactory = context.HttpContext.RequestServices.GetService<ILoggerFactory>();
        if (loggerFactory != null)
        {
            loggerFactory.CreateLogger("ExceptionHandler").LogError(exception,
                $"Error when processing request: {context.HttpContext.Request.Path}");
        }

        if (exception is HumanApiException)
        {
            var apiResponse = new ApiResponse<object>
            {
                Success = false,
                Message = exception.Message,
            };
            context.Result = new OkObjectResult(apiResponse);
            context.ExceptionHandled = true;
        }
        else
        {
            var apiResponse = new ApiResponse<object>
            {
                Success = false,
                Message = exception.Message,
            };
#if !DEBUG
            apiResponse.Message = "Ошибка";
#endif
            context.Result = new OkObjectResult(apiResponse);
            context.ExceptionHandled = true;
        }
    }

}
