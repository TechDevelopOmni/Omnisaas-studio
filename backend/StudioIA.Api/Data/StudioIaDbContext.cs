using Microsoft.EntityFrameworkCore;
using StudioIA.Api.Entities;

namespace StudioIA.Api.Data;

public class StudioIaDbContext(DbContextOptions<StudioIaDbContext> options)
    : DbContext(options)
{
    public DbSet<UserAccount> UserAccounts => Set<UserAccount>();
    public DbSet<ClientAccount> ClientAccounts => Set<ClientAccount>();
    public DbSet<DepartmentSubscription> DepartmentSubscriptions => Set<DepartmentSubscription>();
    public DbSet<CatalogCategory> CatalogCategories => Set<CatalogCategory>();
    public DbSet<CatalogAgent> CatalogAgents => Set<CatalogAgent>();
    public DbSet<ConfiguredAgent> ConfiguredAgents => Set<ConfiguredAgent>();
    public DbSet<PlatformSetting> PlatformSettings => Set<PlatformSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserAccount>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.HasIndex(item => item.Email).IsUnique();
            entity.Property(item => item.Email).HasMaxLength(180);
            entity.Property(item => item.UserName).HasMaxLength(120);
        });

        modelBuilder.Entity<ClientAccount>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.HasIndex(item => item.UserAccountId).IsUnique();
            entity.HasOne(item => item.UserAccount)
                .WithOne(item => item.ClientAccount)
                .HasForeignKey<ClientAccount>(item => item.UserAccountId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DepartmentSubscription>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.HasIndex(item => new { item.ClientAccountId, item.CategoryKey }).IsUnique();
            entity.Property(item => item.MonthlyPrice).HasColumnType("TEXT");
        });

        modelBuilder.Entity<CatalogCategory>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.HasIndex(item => item.Key).IsUnique();
            entity.Property(item => item.MonthlyPrice).HasColumnType("TEXT");
        });

        modelBuilder.Entity<CatalogAgent>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.HasOne(item => item.CatalogCategory)
                .WithMany(item => item.Agents)
                .HasForeignKey(item => item.CatalogCategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ConfiguredAgent>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.HasOne(item => item.ClientAccount)
                .WithMany(item => item.ConfiguredAgents)
                .HasForeignKey(item => item.ClientAccountId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PlatformSetting>(entity =>
        {
            entity.HasKey(item => item.Id);
        });
    }
}
