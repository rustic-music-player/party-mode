using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using NUnit.Framework;
using Rustic.PartyMode.Proxy.Application.contracts.Queries;
using Rustic.PartyMode.Proxy.Domain.Exceptions;
using Rustic.PartyMode.Proxy.Domain.Models;
using Rustic.PartyMode.Proxy.Messaging.Contracts;
using Rustic.PartyMode.Proxy.WebApi.Controllers;

namespace Rustic.PartyMode.Proxy.WebApi.Tests.Controllers
{
    [TestFixture]
    public class RusticControllerTests
    {
        private IExecutor executorMock;
        private RusticController controller;

        [SetUp]
        public void Setup()
        {
            executorMock = Substitute.For<IExecutor>();
            
            controller = new RusticController(executorMock);
        }
        
        [TestCase("some id")]
        [TestCase("another id")]
        public async Task GetShouldQueryInstance(string id)
        {
            RusticApp app = new RusticApp();
            GetInstance query = new GetInstance(id);
            executorMock.Query<GetInstance, RusticApp>(Arg.Is(query)).Returns(app);

            IActionResult result = await controller.Get(id);
            
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.AreEqual(((OkObjectResult) result).Value, app);
        }

        [Test]
        public async Task GetShouldReturnNotFoundWhenNotFoundIsThrown()
        {
            executorMock.Query<GetInstance, RusticApp>(Arg.Any<GetInstance>()).Throws(new NotFoundException());

            IActionResult result = await controller.Get("");
            
            Assert.IsInstanceOf<NotFoundResult>(result);
        }
    }
}