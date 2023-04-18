using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Chatserver.Hubs.Clients;

namespace Chatserver.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
    }
}
