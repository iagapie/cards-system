<?php

declare(strict_types=1);

namespace CategoryService\Api\Application\Command\RemovePermission;

use CategoryService\Api\Infrastructure\Bind\Attribute\FromRoute;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;
use Symfony\Component\Validator\Constraints\Uuid;

final class RemovePermissionCommand
{
    #[FromRoute]
    #[NotBlank, Uuid(versions: [Uuid::V4_RANDOM], strict: true)]
    private string $categoryId;

    #[FromRoute]
    #[NotBlank, Length(max: 50), Regex('/^[\-\w]+$/')]
    private string $permission;

    /**
     * RemovePermissionCommand constructor.
     * @param string $categoryId
     * @param string $permission
     */
    public function __construct(string $categoryId, string $permission)
    {
        $this->categoryId = $categoryId;
        $this->permission = $permission;
    }

    /**
     * @return string
     */
    public function getCategoryId(): string
    {
        return $this->categoryId;
    }

    /**
     * @return string
     */
    public function getPermission(): string
    {
        return $this->permission;
    }
}