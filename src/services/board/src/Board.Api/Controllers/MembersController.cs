using System;
using System.Net;
using System.Threading.Tasks;
using Board.Api.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Board.Api.Controllers
{
    [Route("api/v1/boards/{boardId:guid}/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<MembersController> _logger;

        public MembersController(IMediator mediator, ILogger<MembersController> logger)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [Route("{userId:length(36)}/{roleId:int}")]
        [HttpPut]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AddMemberRole(Guid boardId, string userId, int roleId)
        {
            _logger.LogDebug("----- ADD MEMBER ROLE");

            var command = new AddMemberRoleCommand {BoardId = boardId.ToString(), UserId = userId, RoleId = roleId};

            var result = await _mediator.Send(command);

            if (result) return Ok();

            return BadRequest();
        }

        [HttpDelete]
        [Route("{userId:length(36)}")]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        public async Task<IActionResult> RemoveMember(Guid boardId, string userId)
        {
            _logger.LogDebug("----- REMOVE MEMBER");

            var command = new RemoveMemberCommand {BoardId = boardId.ToString(), UserId = userId};

            var result = await _mediator.Send(command);

            if (result) return Ok();

            return BadRequest();
        }

        [HttpDelete]
        [Route("{userId:length(36)}/{roleId:int}")]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        public async Task<IActionResult> RemoveMemberRole(Guid boardId, string userId, int roleId)
        {
            _logger.LogDebug("----- REMOVE MEMBER ROLE");

            var command = new RemoveMemberRoleCommand {BoardId = boardId.ToString(), UserId = userId, RoleId = roleId};

            var result = await _mediator.Send(command);

            if (result) return Ok();

            return BadRequest();
        }
    }
}