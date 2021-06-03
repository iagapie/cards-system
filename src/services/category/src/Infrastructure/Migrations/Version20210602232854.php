<?php

declare(strict_types=1);

namespace CategoryService\Infrastructure\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210602232854 extends AbstractMigration
{
    public function getDescription() : string
    {
        return 'Create permissions table';
    }

    public function up(Schema $schema) : void
    {
        $this->addSql('
            CREATE TABLE permissions (
                category_id VARCHAR(36) NOT NULL,
                permission VARCHAR(50) NOT NULL,
                PRIMARY KEY(category_id, permission),
                FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE NO ACTION ON DELETE CASCADE
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema) : void
    {
        $this->addSql('DROP TABLE permissions');
    }
}
