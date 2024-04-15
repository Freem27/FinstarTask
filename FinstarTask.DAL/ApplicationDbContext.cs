using FinstarTask.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinstarTask.DAL;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    public DbSet<FinstarRowDbEntity> FinstarRows { get; set; }
}
