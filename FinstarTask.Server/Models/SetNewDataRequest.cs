using FinstarTask.Domain.Models;

namespace FinstarTask.Server.Models
{
    public class SetNewDataRequest
    {
        public List<NewFinstarRow> Items { get; set; } = new();
        public int PageSize { get; set; }
    }
}
