package com.crm.notification_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "app.rabbitmq", name = "enabled", havingValue = "true")
public class RabbitMQConfig {

    public static final String TIER_UPGRADED_QUEUE = "tier.upgrade.queue";
    public static final String POINTS_EARNED_QUEUE = "points.earned.queue";
    public static final String EXCHANGE_NAME = "loyalty.exchange";
    public static final String TIER_UPGRADED_KEY = "tier.upgraded";

    @Bean
    public Queue tierUpgradedQueue() {
        return new Queue(TIER_UPGRADED_QUEUE, true);
    }

    @Bean
    public Queue pointsEarnedQueue() {
        return new Queue(POINTS_EARNED_QUEUE, true);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding tierUpgradedBinding(Queue tierUpgradedQueue, TopicExchange exchange) {
        return BindingBuilder.bind(tierUpgradedQueue).to(exchange).with(TIER_UPGRADED_KEY);
    }

    @Bean
    public Binding pointsEarnedBinding(Queue pointsEarnedQueue, TopicExchange exchange) {
        return BindingBuilder.bind(pointsEarnedQueue).to(exchange).with("points.earned");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
