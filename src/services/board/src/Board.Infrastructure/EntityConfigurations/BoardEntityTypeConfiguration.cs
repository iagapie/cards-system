using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Board.Infrastructure.EntityConfigurations
{
    public class BoardEntityTypeConfiguration : IEntityTypeConfiguration<Domain.AggregatesModel.BoardAggregate.Board>
    {
        public void Configure(EntityTypeBuilder<Domain.AggregatesModel.BoardAggregate.Board> builder)
        {
            builder.ToTable("boards");
            
            builder.Ignore(e => e.DomainEvents);
            
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).ValueGeneratedNever().HasColumnName("id").HasMaxLength(36).IsRequired();
            
            builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
            builder.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();
            
            builder
                .Property<string>("_ownerId")
                .UsePropertyAccessMode(PropertyAccessMode.Field)
                .HasColumnName("owner_id")
                .HasMaxLength(36)
                .IsRequired();
            
            builder
                .Property<string>("_name")
                .UsePropertyAccessMode(PropertyAccessMode.Field)
                .HasColumnName("name")
                .HasMaxLength(150)
                .IsRequired();
            
            builder
                .Property<string>("_description")
                .UsePropertyAccessMode(PropertyAccessMode.Field)
                .HasColumnName("description")
                .IsRequired(false);
            
            builder
                .Metadata
                .FindNavigation(nameof(Domain.AggregatesModel.BoardAggregate.Board.Members))
                .SetPropertyAccessMode(PropertyAccessMode.Field);

            builder.HasIndex("_ownerId");
            builder.HasIndex(e => e.CreatedAt);
            builder.HasIndex(e => e.UpdatedAt);
        }
    }
}