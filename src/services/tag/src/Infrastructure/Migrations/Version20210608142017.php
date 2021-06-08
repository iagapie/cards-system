<?php

declare(strict_types=1);

namespace TagService\Infrastructure\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210608142017 extends AbstractMigration
{
    public function getDescription() : string
    {
        return 'Create tags table';
    }

    public function up(Schema $schema) : void
    {
        $this->addSql('
            CREATE TABLE tags (
                id VARCHAR(36) NOT NULL,
                board_id VARCHAR(36) NOT NULL,
                name VARCHAR(100) NOT NULL,
                color VARCHAR(100) NOT NULL,
                created_at DATETIME NOT NULL DEFAULT NOW(),
                updated_at DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
                INDEX IDX_Tag_1 (board_id),
                INDEX IDX_Tag_2 (created_at),
                INDEX IDX_Tag_3 (updated_at),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('DROP TABLE tags');
    }
}
