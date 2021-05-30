using System;
using Board.Domain.AggregatesModel.BoardAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Board.Infrastructure.EntityConfigurations
{
    public class MemberEntityTypeConfiguration : IEntityTypeConfiguration<Member>
    {
        public void Configure(EntityTypeBuilder<Member> builder)
        {
            builder.ToTable("members");

            builder.Ignore(e => e.DomainEvents);
            
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).ValueGeneratedNever().HasColumnName("id").HasMaxLength(36).IsRequired();
            
            builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
            builder.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();
            
            builder
                .Property<Guid>("BoardId")
                .HasColumnName("board_id")
                .IsRequired();
            
            builder
                .Property<string>("_userId")
                .UsePropertyAccessMode(PropertyAccessMode.Field)
                .HasColumnName("user_id")
                .HasMaxLength(36)
                .IsRequired();
            
            builder
                .Property<int>("_roleId")
                .UsePropertyAccessMode(PropertyAccessMode.Field)
                .HasColumnName("role_id")
                .IsRequired();

            builder
                .HasOne(e => e.Role)
                .WithMany()
                .HasForeignKey("_roleId")
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex("BoardId", "_userId", "_roleId").IsUnique();
            builder.HasIndex(e => e.UpdatedAt);
            builder.HasIndex("_userId");
        }
    }
}