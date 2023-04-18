using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Chatserver.Models;

namespace Chatserver.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);
    }
}
