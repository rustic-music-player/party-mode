using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Rustic.PartyMode.Proxy.Application.Contracts.Commands;
using Rustic.PartyMode.Proxy.Application.contracts.Queries;
using Rustic.PartyMode.Proxy.Domain.Exceptions;
using Rustic.PartyMode.Proxy.Domain.Models;
using Rustic.PartyMode.Proxy.Messaging.Contracts;

namespace Rustic.PartyMode.Proxy.WebApi.Controllers
{
    [ApiController]
    [Route("api/rustic")]
    public class RusticController : ControllerBase
    {
        private readonly IExecutor executor;

        public RusticController(IExecutor executor)
        {
            this.executor = executor;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                RusticApp result = await this.executor.Query<GetInstance, RusticApp>(new GetInstance(id));

                return Ok(result);
            }
            catch (NotFoundException e)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task Add(RusticApp rustic)
        {
            await this.executor.Send(new AddInstance(rustic));
        }
    }
}