using Board.Domain.AggregatesModel.BoardAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Board.Infrastructure.EntityConfigurations
{
    public class RoleEntityTypeConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("roles");
            
            builder.Property(o => o.Id)
                .HasDefaultValue(10)
                .ValueGeneratedNever()
                .HasColumnName("id")
                .IsRequired();

            builder.Property(o => o.Name)
                .HasColumnName("name")
                .HasMaxLength(50)
                .IsRequired();
        }
    }
}