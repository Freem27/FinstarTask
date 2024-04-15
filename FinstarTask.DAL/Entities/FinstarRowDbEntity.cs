using System.ComponentModel.DataAnnotations;

namespace FinstarTask.DAL.Entities;

public class FinstarRowDbEntity
{
    [Key]
    public int RowNum { get; set; }
    public int Code { get; set; }
    public string Value { get; set; } = null!;
}
