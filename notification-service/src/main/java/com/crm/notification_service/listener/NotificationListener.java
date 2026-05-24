package com.crm.notification_service.listener;

import com.crm.notification_service.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
@ConditionalOnProperty(prefix = "app.rabbitmq", name = "enabled", havingValue = "true")
public class NotificationListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationListener.class);

    @RabbitListener(queues = RabbitMQConfig.TIER_UPGRADED_QUEUE)
    public void handleTierUpgraded(Map<String, Object> event) {
        String customerId = String.valueOf(event.get("customerId"));
        String ancienTier = String.valueOf(event.get("ancienTier"));
        String nouveauTier = String.valueOf(event.get("nouveauTier"));
        log.info("[NOTIFICATION] Client {} - Felicitations ! Vous etes passe {} -> {}. Vos nouveaux avantages LuxStay Rewards sont actifs.",
            customerId, ancienTier, nouveauTier);
    }

    @RabbitListener(queues = RabbitMQConfig.POINTS_EARNED_QUEUE)
    public void handlePointsEarned(Map<String, Object> event) {
        log.info("💰 Points gagnés !");
        log.info("Client ID : {}", event.get("customerId"));
        log.info("Points : {}", event.get("points"));
        log.info("→ Notification envoyée : Vous avez gagné {} points !", event.get("points"));
    }
}
