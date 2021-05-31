using System;
using System.Net;
using System.Threading.Tasks;
using Board.Api.Application.Commands;
using Board.Api.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Range = Board.Api.Application.Queries.Range;

namespace Board.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class BoardsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IBoardQueries _queries;
        private readonly ILogger<BoardsController> _logger;

        public BoardsController(IMediator mediator, IBoardQueries queries, ILogger<BoardsController> logger)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
            _queries = queries ?? throw new ArgumentNullException(nameof(queries));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [Route("count")]
        [HttpGet]
        [ProducesResponseType(typeof(CountBoards), (int) HttpStatusCode.OK)]
        public async Task<ActionResult<CountBoards>> CountBoards([FromQuery] Criteria criteria)
        {
            _logger.LogDebug("----- GETTING BOARDS");

            var count = await _queries.Count(criteria);

            return Ok(count);
        }


        [HttpGet]
        [ProducesResponseType(typeof(BoardList), (int) HttpStatusCode.OK)]
        public async Task<ActionResult<BoardList>> GetBoardList([FromQuery] Criteria criteria, [FromQuery] Range range,
            [FromQuery] Sort sort)
        {
            _logger.LogDebug("----- GETTING BOARDS");

            var boards = await _queries.GetBoards(criteria, range, sort);

            return Ok(boards);
        }

        [Route("{boardId:guid}")]
        [HttpGet]
        [ProducesResponseType(typeof(Application.Queries.Board), (int) HttpStatusCode.OK)]
        [ProducesResponseType((int) HttpStatusCode.NotFound)]
        public async Task<ActionResult<Application.Queries.Board>> GetBoard(Guid boardId)
        {
            _logger.LogDebug("----- GETTING BOARD");

            try
            {
                var board = await _queries.GetBoard(boardId);

                return Ok(board);
            }
            catch (Exception e)
            {
                _logger.LogTrace(e, "GetBoard error");

                return NotFound();
            }
        }

        [HttpPost]
        [ProducesResponseType((int) HttpStatusCode.Created)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        public async Task<IActionResult> CreateBoard([FromBody] CreateBoardCommand command)
        {
            _logger.LogDebug("----- CREATING BOARD");

            command = command with {Id = Guid.NewGuid().ToString()};

            var result = await _mediator.Send(command);

            if (!result) return BadRequest();

            return CreatedAtAction(nameof(GetBoard), "Boards", new {boardId = command.Id}, null);
        }

        [Route("{boardId:guid}")]
        [HttpPut]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        public async Task<IActionResult> UpdateBoard(Guid boardId, [FromBody] UpdateBoardCommand command)
        {
            _logger.LogDebug("----- UPDATING BOARD");

            command = command with {Id = boardId.ToString()};

            var result = await _mediator.Send(command);

            if (result) return NoContent();
            
            return BadRequest();
        }

        [Route("{boardId:guid}")]
        [HttpDelete]
        [ProducesResponseType((int) HttpStatusCode.NoContent)]
        [ProducesResponseType((int) HttpStatusCode.BadRequest)]
        public async Task<IActionResult> RemoveBoard(Guid boardId)
        {
            _logger.LogDebug("----- REMOVING BOARD");

            var command = new RemoveBoardCommand {Id = boardId.ToString()};
            var result = await _mediator.Send(command);

            if (result) return NoContent();
            
            return BadRequest();
        }
    }
}