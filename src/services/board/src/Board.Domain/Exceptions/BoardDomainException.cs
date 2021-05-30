using System;

namespace Board.Domain.Exceptions
{
    public class BoardDomainException : Exception
    {
        public BoardDomainException()
        {
        }

        public BoardDomainException(string message) : base(message)
        {
        }

        public BoardDomainException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}