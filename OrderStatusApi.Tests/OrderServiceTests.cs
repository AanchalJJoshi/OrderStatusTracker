using System;
using System.Collections.Generic;
using Moq;
using Xunit;
using SupportApi.Models;
using SupportApi.Services;
using SupportApi.Repositories;

namespace SupportApi.Tests
{
    public class OrderServiceTests
    {
        private readonly Mock<IOrderRepository> _repoMock;
        private readonly OrderService _service;

        public OrderServiceTests()
        {
            _repoMock = new Mock<IOrderRepository>();
            _service = new OrderService(_repoMock.Object);
        }

        private Order CreateSampleOrder()
        {
            return new Order
            {
                Id = "ORD123",
                Status = OrderStatus.Placed,
                Customer = new Customer
                {
                    Email = "test@example.com",
                    Mobile = "9999999999"
                },
                Timeline = new List<OrderTimelineEvent>(),
                Notes = new List<OrderNote>()
            };
        }

        [Fact]
        public void UpdateStatus_InvalidTransition_ShouldThrowException()
        {
            // Arrange
            var order = CreateSampleOrder();
            order.Status = OrderStatus.Placed;

            // Act & Assert
            var ex = Assert.Throws<InvalidOperationException>(() =>
                _service.UpdateStatus(order, OrderStatus.Shipped)
            );

            Assert.Contains("Cannot change status", ex.Message);
        }

        [Fact]
        public void UpdateStatus_ValidTransition_ShouldAppendTimelineEvent()
        {
            // Arrange
            var order = CreateSampleOrder();

            // Act
            _service.UpdateStatus(order, OrderStatus.Paid);

            // Assert
            Assert.Equal(OrderStatus.Paid, order.Status);
            Assert.Single(order.Timeline);
            Assert.Equal(OrderStatus.Paid, order.Timeline[0].Status);
        }

        [Fact]
        public void AddNote_ExceedsMaxLength_ShouldThrowException()
        {
            // Arrange
            var order = CreateSampleOrder();
            var longNote = new string('a', 1001);

            // Act & Assert
            var ex = Assert.Throws<ArgumentException>(() =>
                _service.AddNote(order, longNote, "agent1")
            );

            Assert.Contains("cannot exceed", ex.Message);
        }

        [Fact]
        public void Search_ShouldMatchByEmailPartial()
        {
            // Arrange
            var orders = new List<Order>
            {
                CreateSampleOrder(),
                new Order
                {
                    Id = "ORD999",
                    Customer = new Customer
                    {
                        Email = "other@test.com",
                        Mobile = "8888888888"
                    }
                }
            };

            _repoMock.Setup(r => r.GetAll()).Returns(orders);

            // Act
            var result = _service.SearchOrders("example");

            // Assert
            Assert.Single(result);
            Assert.Equal("ORD123", result[0].Id);
        }

        [Fact]
        public void GetOrderById_OrderDoesNotExist_ShouldReturnNull()
        {
            // Arrange
            _repoMock.Setup(r => r.GetById("INVALID")).Returns((Order)null);

            // Act
            var result = _service.GetOrderById("INVALID");

            // Assert
            Assert.Null(result);
        }
    }
}
