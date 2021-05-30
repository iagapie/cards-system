using Board.Domain.AggregatesModel.BoardAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Board.Infrastructure.EntityConfigurations
{
    public class VisibilityEntityTypeConfiguration : IEntityTypeConfiguration<Visibility>
    {
        public void Configure(EntityTypeBuilder<Visibility> builder)
        {
            builder.ToTable("visibilities");
            
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