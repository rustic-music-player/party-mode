using System.Diagnostics.CodeAnalysis;
using Rustic.PartyMode.Proxy.Messaging.Contracts.Queries;

namespace Rustic.PartyMode.Proxy.Application.contracts.Queries
{
    public class GetInstance : IQuery<Domain.Models.RusticApp>
    {
        public GetInstance([NotNull] string id)
        {
            Id = id;
        }

        [NotNull]
        public string Id { get; }

        protected bool Equals(GetInstance other)
        {
            return Id == other.Id;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((GetInstance) obj);
        }

        public override int GetHashCode()
        {
            return (Id != null ? Id.GetHashCode() : 0);
        }
    }
}