namespace FinstarTask.Server.Controllers.Base;

public class ApiResponse<T> where T : class
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; } = default;
}
