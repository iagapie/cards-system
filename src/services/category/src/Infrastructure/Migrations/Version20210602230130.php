<?php

declare(strict_types=1);

namespace CategoryService\Infrastructure\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210602230130 extends AbstractMigration
{
    public function getDescription() : string
    {
        return 'Create categories table';
    }

    public function up(Schema $schema) : void
    {
        $this->addSql('
            CREATE TABLE categories (
                id VARCHAR(36) NOT NULL,
                parent_id VARCHAR(36) DEFAULT NULL,
                board_id VARCHAR(36) NOT NULL,
                created_by VARCHAR(36) NOT NULL,
                name VARCHAR(150) NOT NULL,
                description VARCHAR(1000) DEFAULT NULL,
                position INT NOT NULL DEFAULT \'0\',
                created_at DATETIME NOT NULL DEFAULT NOW(),
                updated_at DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
                INDEX IDX_Cat_1 (board_id),
                INDEX IDX_Cat_2 (board_id,parent_id),
                INDEX IDX_Cat_3 (board_id,position),
                INDEX IDX_Cat_4 (board_id,position,updated_at),
                INDEX IDX_Cat_5 (position),
                INDEX IDX_Cat_6 (created_at),
                INDEX IDX_Cat_7 (updated_at),
                INDEX IDX_Cat_8 (created_by),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('DROP TABLE categories');
    }
}
