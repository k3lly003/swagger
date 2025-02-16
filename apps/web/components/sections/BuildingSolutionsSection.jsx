'use client'

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import CategoriesBanner from "@/components/layout/headerBanner";

const BuildingSolutionsSection = ({ dict, categories, tags }) => {
  const sceneRef = useRef(null);
  const containerRef = useRef(null);
  const [matterLoaded, setMatterLoaded] = useState(false);
  
  // Handle Matter.js script loading
  const handleMatterLoad = () => {
    setMatterLoaded(true);
  };
  
  useEffect(() => {
    // Check if Matter.js is already available in the window
    if (window.Matter) {
      setMatterLoaded(true);
    }
    
    // Cleanup function
    return () => {
      // Any cleanup code will be moved to the main effect
    };
  }, []);
  
  useEffect(() => {
    // Only run once the component is mounted, ref is available AND Matter.js is loaded
    if (!sceneRef.current || !matterLoaded || !window.Matter) return;
    
    let render, engine, runner, tagContainer;
    
    try {
      const Matter = window.Matter;
      const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;
      
      // Create engine with reduced gravity - EVEN LIGHTER for slower motion
      engine = Engine.create();
      engine.world.gravity.y = 0.1; // Reduced from 0.2 for slower falling
      
      // Setup canvas size - reduced height further
      const canvasSize = {
        width: sceneRef.current.clientWidth,
        height: 200
      };
      
      // Create renderer
      render = Render.create({
        element: sceneRef.current,
        engine: engine,
        options: {
          ...canvasSize,
          background: "transparent",
          wireframes: false
        }
      });
      
      // Create boundaries
      const params = {
        isStatic: true,
        render: {
          fillStyle: "transparent"
        }
      };
      
      const floor = Bodies.rectangle(
        canvasSize.width / 2,
        canvasSize.height,
        canvasSize.width,
        50,
        params
      );
      
      const wall1 = Bodies.rectangle(
        0,
        canvasSize.height / 2,
        50,
        canvasSize.height,
        params
      );
      
      const wall2 = Bodies.rectangle(
        canvasSize.width,
        canvasSize.height / 2,
        50,
        canvasSize.height,
        params
      );
      
      const top = Bodies.rectangle(
        canvasSize.width / 2,
        0,
        canvasSize.width,
        50,
        params
      );
      
      // Create tag elements
      tagContainer = document.createElement('div');
      tagContainer.className = 'absolute inset-0 pointer-events-none';
      tagContainer.style.zIndex = '10';
      sceneRef.current.appendChild(tagContainer);
      
      // Create tag elements and physics bodies
      const wordElements = tags.map((tag) => {
        const tagElement = document.createElement('div');
        tagElement.className = `${tag.color} text-white rounded-full px-4 py-2 inline-block font-medium text-sm shadow-md whitespace-nowrap absolute pointer-events-auto cursor-grab`;
        tagElement.innerText = tag.text;
        tagContainer.appendChild(tagElement);
        return tagElement;
      });
      
      // Create physics bodies for tags with modified properties for slower movement
      const wordBodies = wordElements.map((elemRef) => {
        const width = elemRef.offsetWidth;
        const height = elemRef.offsetHeight;
        return {
          body: Bodies.rectangle(
            // Start all tags in the center with slight random offset
            canvasSize.width / 2 + (Math.random() * 20 - 10),
            canvasSize.height / 2 + (Math.random() * 20 - 10),
            width, 
            height, 
            {
              restitution: 0.3,    // Reduced from 0.5 for less bounce
              friction: 0.08,      // Increased from 0.05 for more drag
              frictionAir: 0.005,  // Increased from 0.002 for more air resistance
              density: 0.001,      // Kept light bodies
              render: {
                fillStyle: "transparent"
              }
            }
          ),
          elem: elemRef,
          render() {
            const { x, y } = this.body.position;
            this.elem.style.top = `${y - height/2}px`;
            this.elem.style.left = `${x - width/2}px`;
            this.elem.style.transform = `rotate(${this.body.angle}rad)`;
          }
        };
      });
      
      // Add mouse control
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.15, // Reduced from 0.2 for gentler mouse interaction
          render: {
            visible: false
          }
        }
      });
      
      // Remove default mouse wheel events
      mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
      
      // Add all bodies to world
      World.add(engine.world, [
        floor,
        wall1,
        wall2,
        top,
        ...wordBodies.map((box) => box.body),
        mouseConstraint
      ]);
      
      // Set mouse for render
      render.mouse = mouse;
      
      // Apply gentler initial velocities to make the words move outward more slowly
      wordBodies.forEach(word => {
        // Calculate direction vector from center
        const centerX = canvasSize.width / 2;
        const centerY = canvasSize.height / 2;
        const bodyX = word.body.position.x;
        const bodyY = word.body.position.y;
        
        // Normalize direction vector
        const dx = bodyX - centerX;
        const dy = bodyY - centerY;
        const magnitude = Math.sqrt(dx * dx + dy * dy) || 1;
        
        // Apply velocity outward from center with even gentler force
        Matter.Body.setVelocity(word.body, {
          x: (dx / magnitude) * 1.5 + (Math.random() - 0.5) * 0.7, // Reduced from 2 and 1
          y: (dy / magnitude) * 1.5 + (Math.random() - 0.5) * 0.7  // Reduced from 2 and 1
        });
      });
      
      // Run the engine with slower timeScale for even slower simulation
      runner = Runner.create();
      engine.timing.timeScale = 0.9; // Slow down the whole simulation to 90% of normal speed
      Runner.run(runner, engine);
      Render.run(render);
      
      // Animation loop
      const animationFrame = requestAnimationFrame(function rerender() {
        wordBodies.forEach(element => {
          element.render();
        });
        requestAnimationFrame(rerender);
      });
      
      // Store the animation frame ID for cleanup
      sceneRef.current.animationFrameId = animationFrame;
    } catch (error) {
      console.error("Error initializing Matter.js:", error);
    }
    
    // Cleanup function
    return () => {
      if (window.Matter && render && engine && runner) {
        // Stop the renderer
        window.Matter.Render.stop(render);
        window.Matter.Runner.stop(runner);
        
        // Cancel animation frame if it exists
        if (sceneRef.current && sceneRef.current.animationFrameId) {
          cancelAnimationFrame(sceneRef.current.animationFrameId);
        }
        
        // Remove canvas
        if (render.canvas) {
          render.canvas.remove();
        }
        
        // Clear engine
        window.Matter.Engine.clear(engine);
      }
      
      // Remove tag container
      if (tagContainer && tagContainer.parentNode) {
        tagContainer.parentNode.removeChild(tagContainer);
      }
    };
  }, [tags, matterLoaded]); // Add matterLoaded to dependencies
  
  return (
    <>
      {/* Load Matter.js from CDN with onLoad callback */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js" 
        strategy="beforeInteractive"
        onLoad={handleMatterLoad}
      />
      
      <section className="py-8 bg-white relative overflow-hidden" ref={containerRef}>
        {/* Main heading */}
        <div className="container mx-auto px-4 mb-2">
          <h2 className="text-4xl font-bold text-center">
            <span className="text-green-800">
              {dict?.building_solutions?.heading_1 || "Building Sustainable "}
            </span>
            <span className="text-primary-orange">
              {dict?.building_solutions?.heading_2 || "Solutions With"}
            </span>
            <br />
            <span className="text-primary-orange">
              {dict?.building_solutions?.heading_3 || "African Communities!"}
            </span>
          </h2>
        </div>

        {/* Physics engine container for floating tags - reduced height further */}
        <div 
          ref={sceneRef} 
          className="w-full relative" 
          style={{ height: "200px" }}
        />

        {/* Categories Banner Component - full width with slanted design */}
        <div className="w-full">
          <CategoriesBanner categories={categories} />
        </div>
      </section>
    </>
  );
};

export default BuildingSolutionsSection;