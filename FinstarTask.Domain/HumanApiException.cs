namespace FinstarTask.Domain;

public class HumanApiException : ApplicationException
{
    public HumanApiException(string message) : base(message) { }
}
