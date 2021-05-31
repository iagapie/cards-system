using System.Linq;
using System.Net;
using Board.Api.Application.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Board.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(typeof(RoleList), (int) HttpStatusCode.OK)]
        public ActionResult<RoleList> GetRoles()
        {
            return Ok(new RoleList
            {
                Roles = Domain.AggregatesModel.BoardAggregate.Role.List()
                    .Where(x => !Domain.AggregatesModel.BoardAggregate.Role.Owner.Equals(x))
                    .Select(x => new Role
                    {
                        Id = x.Id,
                        Name = x.Name
                    })
            });
        }
    }
}