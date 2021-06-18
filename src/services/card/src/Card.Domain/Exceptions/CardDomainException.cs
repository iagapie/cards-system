using System;

namespace Card.Domain.Exceptions
{
    public class CardDomainException : Exception
    {
        public CardDomainException()
        {
        }

        public CardDomainException(string message): base(message)
        {
        }
        
        public CardDomainException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}